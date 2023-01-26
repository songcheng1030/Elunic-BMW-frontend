import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { isEqual, last, omit, pick } from 'lodash-es';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { Editor, RawEditorSettings } from 'tinymce';

import { EDITOR_SETTINGS } from '../../util/editor';
import { getImgSrc } from '../../util/file';
import {
  AttachmentCandidate,
  AttachmentDto,
  CreateUseCaseDto,
  DetailedRequestStep,
  extractUseCaseName,
  getCompletedSteps,
  getCurrentStep,
  InitialFeasibilityCheckStep,
  InitialRequestStep,
  isCandidate,
  isUseCaseDone,
  LOCKED_TAG,
  NO_DOT_PATTERN,
  OfferStep,
  OrderStep,
  SetupDetailsStep,
  STEPS,
  SUB_STEPS_MAP,
  USE_CASE_FORM_STEPS,
  USE_CASE_STEPS_ROLES_MAP,
  UseCaseDto,
  UseCaseFormStep,
  UseCaseFormStepTuple,
  UseCaseFormSubStep,
} from '../models';
import { AuthService } from './auth.service';
import { FileService } from './file.service';

const READONLY_PROPS = [
  'id',
  'createdAt',
  'updatedAt',
  'createdBy',
  'image',
  'status',
  'steps',
] as const;
const MIN_REQUIRED_KEYS = ['name', 'plantId', 'building'] as const;
const ROOT_LEVEL_KEYS = [...MIN_REQUIRED_KEYS, 'line', 'position'] as const;
const IGNORED_FORM_PROS = ['attachments', 'files'] as const;

// This only serves to check types.
// Ensures the defined arrays contain only keys of the UseCaseDto.
// eslint-disable-next-line
const __TEST_ARRAY: (keyof UseCaseDto)[] = [...READONLY_PROPS, ...ROOT_LEVEL_KEYS];

interface AttachmentChanges {
  added: AttachmentCandidate[];
  updated: AttachmentDto[];
  removed: AttachmentDto[];
}

type ControlConfig = [string, (ValidatorFn | ValidatorFn[])?];

const ROOT_LEVEL_FORM: Record<typeof ROOT_LEVEL_KEYS[number], ControlConfig> = {
  name: ['', [Validators.required, Validators.minLength(1)]],
  plantId: ['', [Validators.required, Validators.pattern(NO_DOT_PATTERN)]],
  building: ['', [Validators.required, Validators.pattern(NO_DOT_PATTERN)]],
  line: ['', Validators.pattern(NO_DOT_PATTERN)],
  position: ['', Validators.pattern(NO_DOT_PATTERN)],
};

@Injectable({ providedIn: 'root' })
export class UseCaseConfiguratorService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private update$ = new Subject<void>();

  private useCase?: Partial<UseCaseDto>;
  private attachments: (AttachmentDto | AttachmentCandidate)[] = [];
  private editors = new Map<string, Editor>();
  private rootForm = this.fb.group(ROOT_LEVEL_FORM);
  private forms = new Map<UseCaseFormSubStep, FormGroup>();
  private subs = new Map<UseCaseFormSubStep, Subscription>();

  name?: string;
  showMandatoryOnly$ = new BehaviorSubject(false);
  offerAcceptable$ = new BehaviorSubject(false);
  validSubForms$ = this.update$.pipe(
    map(() => [...this.forms.entries()].filter(([, value]) => value.valid).map(([key]) => key)),
  );
  disabledSteps$ = this.update$.pipe(
    debounceTime(100),
    startWith(null),
    map(() => USE_CASE_FORM_STEPS.filter(step => this.isStepDisabled(step))),
  );
  canSubmit$ = this.update$.pipe(
    debounceTime(100),
    startWith(null),
    map(
      () =>
        this.rootForm.disabled ||
        !Object.values(pick(this.rootForm.controls, ROOT_LEVEL_KEYS)).some(
          c => !c.disabled && !c.valid,
        ),
    ),
  );

  set showMandatoryOnly(value: boolean) {
    this.showMandatoryOnly$.next(value);
  }

  get showMandatoryOnly() {
    return this.showMandatoryOnly$.value;
  }

  get completedSteps() {
    return getCompletedSteps(this.useCase || {});
  }

  get meta() {
    return this.useCase
      ? { ...pick(this.useCase, READONLY_PROPS), step: getCurrentStep(this.useCase) }
      : {};
  }

  get declined() {
    return this.useCase?.status === 'declined';
  }

  get hasUserDeclined() {
    const { feasibilityCheck } = this.getStep('initial-feasibility-check');
    const { implementationFeasibilityCheck } = this.getStep('offer');
    return feasibilityCheck?.value === false || implementationFeasibilityCheck?.value === false;
  }

  get disabledByDecline() {
    const { feasibilityCheck } = this.getStep('initial-feasibility-check');
    const { implementationFeasibilityCheck } = this.getStep('offer');
    return (
      (this.isStepCompleted('initial-feasibility-check') && feasibilityCheck?.value === false) ||
      (this.isStepCompleted('offer') && implementationFeasibilityCheck?.value === false)
    );
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private fileService: FileService,
  ) {
    // This is needed so shared controls are updating the root form.
    Object.entries(this.rootForm.controls).forEach(([key, value]) => {
      value.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(v => this.rootForm.patchValue({ [key]: v }, { emitEvent: false }));
    });
  }

  ngOnDestroy() {
    this.update$.complete();

    this.destroy$.next();
    this.destroy$.complete();
  }

  init(useCase: Partial<UseCaseDto>) {
    const name = extractUseCaseName(useCase.name || '');

    this.useCase = useCase;
    this.name = useCase.name;
    this.rootForm.patchValue(pick({ ...useCase, name }, ROOT_LEVEL_KEYS));

    if (useCase.attachments) {
      this.attachments = [...useCase.attachments];
    }
  }

  register(subStep: UseCaseFormSubStep, form: FormGroup) {
    const current = this.forms.get(subStep);
    if (current) {
      form.patchValue(current.getRawValue());
    } else {
      const step = Object.entries(SUB_STEPS_MAP).find(([, steps]) => steps.includes(subStep));
      if (step && this.useCase?.steps) {
        const value = this.useCase.steps.find(s => s.type === step[0]);
        form.patchValue(value?.form || {});
      }
    }
    this.forms.set(subStep, form);

    const sub = form.valueChanges
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => this.update$.next());

    this.subs.get(subStep)?.unsubscribe();
    this.subs.set(subStep, sub);

    if (!this.canEditSubStep(subStep)) {
      form.disable();
    }
    this.update$.next();
  }

  close() {
    this.useCase = undefined;
    this.attachments = [];
    this.rootForm.reset();
    this.rootForm.enable();
    this.forms = new Map();
    [...this.subs.values()].forEach(s => s.unsubscribe());
    this.subs = new Map();
  }

  hasFormChanged(): boolean {
    if (!this.useCase) {
      return true;
    }

    const dto = this.getDto();
    const changed = !isEqual(
      pick({ ...this.useCase, name: extractUseCaseName(this.name || '') }, ROOT_LEVEL_KEYS),
      pick({ ...dto }, ROOT_LEVEL_KEYS),
    );

    if (changed) {
      return true;
    }
    // eslint-disable-next-line
    return !!this.useCase.steps?.some(s => !isEqual(s.form, this.getStep(s.type as any)));
  }

  getRootControls() {
    return this.rootForm.controls as Record<typeof ROOT_LEVEL_KEYS[number], AbstractControl>;
  }

  getDto() {
    const form = this.rootForm.getRawValue() as CreateUseCaseDto;
    const nameChanged = form.name !== this.name;

    return {
      ...form,
      name: (nameChanged ? form.name : undefined) as string,
    } as CreateUseCaseDto;
  }

  getAttachments() {
    return [...this.attachments];
  }

  getEditors() {
    return [...this.editors.values()];
  }

  getStep(step: 'initial-request'): Partial<InitialRequestStep['form']>;
  getStep(step: 'initial-feasibility-check'): Partial<InitialFeasibilityCheckStep['form']>;
  getStep(step: 'detailed-request'): Partial<DetailedRequestStep['form']>;
  getStep(step: 'offer'): Partial<OfferStep['form']>;
  getStep(step: 'order'): Partial<OrderStep['form']>;
  getStep(step: 'setup-details'): Partial<SetupDetailsStep['form']>;
  getStep(step: UseCaseFormStep) {
    const existing = (this.useCase?.steps || []).find(s => s.type === step)?.form || {};
    const subSteps = SUB_STEPS_MAP[step];
    const values = [...this.forms.entries()]
      .filter(([key]) => subSteps.includes(key))
      .map(([, form]) => omit(form.value, [...ROOT_LEVEL_KEYS, ...IGNORED_FORM_PROS]) as object);
    return values.reduce((prev, curr) => ({ ...prev, ...curr }), existing);
  }

  getSubStepForm(step: UseCaseFormSubStep) {
    return this.forms.get(step) || new FormGroup({});
  }

  getChangedSteps(): UseCaseFormStepTuple[] {
    if (this.useCase && this.useCase.steps && this.useCase.steps.length > 0) {
      const steps = [...this.useCase.steps];
      return USE_CASE_FORM_STEPS.filter(step => {
        const existing = steps.find(s => s.type === step);
        // eslint-disable-next-line
        const form = this.getStep(step as any);
        const formUsed = Object.keys(form).length > 0;
        return formUsed && (!existing || !isEqual(existing.form, form));
        // eslint-disable-next-line
      }).map(step => [step, this.getStep(step as any)]);
    }
    return [['initial-request', this.getStep('initial-request')]];
  }

  isStepCompleted(step: UseCaseFormStep): boolean {
    return this.completedSteps.some(s => s.type === step);
  }

  isSubStepCompleted(step: UseCaseFormSubStep): boolean {
    if (step === 'estimated_price') {
      // Empty step
      return true;
    }
    const form = this.getSubStepForm(step);
    return Object.keys(form.controls).length > 0 && form.valid;
  }

  isUseCaseDone() {
    return this.useCase ? isUseCaseDone(this.useCase) : false;
  }

  getOverallProgress(): number {
    if (!this.useCase) {
      return 0;
    }
    if (isUseCaseDone(this.useCase)) {
      return 100;
    }

    let currentProgressStep: UseCaseFormStep = 'initial-request';
    for (const key of USE_CASE_FORM_STEPS) {
      if (!this.isStepCompleted(key as UseCaseFormStep)) {
        currentProgressStep = key as UseCaseFormStep;
        break;
      }
    }

    const subStepProg = SUB_STEPS_MAP[currentProgressStep].reduce(
      (prev, curr) => prev + (this.isSubStepCompleted(curr) ? 1 : 0),
      0,
    );

    const progressStep = (100 / STEPS.length) * this.completedSteps.length;
    const progressSubStep =
      ((subStepProg / SUB_STEPS_MAP[currentProgressStep].length) * 100) / STEPS.length;

    return Math.round(progressStep + progressSubStep);
  }

  getEditorSettings(step: UseCaseFormStep): RawEditorSettings {
    return {
      ...EDITOR_SETTINGS,
      id: Math.floor(Math.random() * 1000).toString(),
      images_upload_handler: this.getUploadHandler(step),
    };
  }

  addEditor(step: UseCaseFormSubStep, editor: Editor) {
    this.editors.set(step, editor);
    // Because editor image upload requires an use case id we disable the editor if there is no id yet.
    if (!this.useCase?.id) {
      editor.setMode('readonly');
    }
  }

  addAttachment(dto: AttachmentCandidate) {
    this.attachments = [...this.attachments, dto];
  }

  updateAttachment(dto: AttachmentDto) {
    const index = this.attachments.findIndex(a => !isCandidate(a) && a.id === dto.id);
    if (index > -1) {
      this.attachments[index] = dto;
    }
  }

  replaceAttachment(type: string, attachments: (AttachmentDto | AttachmentCandidate)[]) {
    const remaining = this.attachments.filter(a => a.type !== type);
    this.attachments = [...remaining, ...attachments];
  }

  removeAttachment(idOrFile: string | File) {
    if (typeof idOrFile === 'string') {
      this.attachments = this.attachments.filter(a => !isCandidate(a) && a.id !== idOrFile);
    } else {
      this.attachments = this.attachments.filter(a => isCandidate(a) && a.file === idOrFile);
    }
  }

  getAttachmentChanges(): AttachmentChanges {
    const dtos = this.attachments.filter(a => !isCandidate(a)) as AttachmentDto[];
    const added = this.attachments.filter(a => isCandidate(a)) as AttachmentCandidate[];
    return {
      added,
      removed: (this.useCase?.attachments || []).filter(a => !dtos.some(dto => dto.id === a.id)),
      updated: dtos.filter(a =>
        (this.useCase?.attachments || []).some(dto => dto.id === a.id && !isEqual(dto, a)),
      ),
    };
  }

  markStepAsTouched(subStep: UseCaseFormSubStep) {
    const entry = this.forms.get(subStep);
    entry?.markAllAsTouched();
  }

  canEditStep(step: UseCaseFormStep) {
    if (this.authService.isAIQXTeam) {
      // AIQX role may edit everything but not complete.
      return true;
    }

    const lastCompleted = last(this.completedSteps);
    if (!lastCompleted) {
      return step === 'initial-request';
    }

    const nextStep: UseCaseFormStep | undefined =
      USE_CASE_FORM_STEPS[USE_CASE_FORM_STEPS.indexOf(lastCompleted.type) + 1];

    return !(step !== nextStep || !USE_CASE_STEPS_ROLES_MAP[this.authService.role].includes(step));
  }

  canComplete(step: UseCaseFormStep) {
    if (!this.useCase?.id || step === 'initial-request') {
      return !this.isStepDisabled(step);
    }

    if (this.isStepCompleted(step)) {
      return false;
    }

    const lastCompleted = last(this.completedSteps);
    if (lastCompleted) {
      const currentIndex = USE_CASE_FORM_STEPS.findIndex(s => s === lastCompleted.type);
      const stepIndex = USE_CASE_FORM_STEPS.findIndex(s => s === step);
      return stepIndex - currentIndex === 1;
    }
    return false;
  }

  canEditSubStep(subStep: UseCaseFormSubStep) {
    const step = this.getCurrentSubStep(subStep);
    return this.canEditStep(step);
  }

  private getCurrentSubStep(subStep: UseCaseFormSubStep): UseCaseFormStep {
    const found = Object.entries(SUB_STEPS_MAP).find(([, steps]) => steps.includes(subStep));
    if (!found) {
      throw Error('Unknown sub step: ' + subStep);
    }

    return found[0] as UseCaseFormStep;
  }

  private isStepDisabled(step: UseCaseFormStep) {
    if (this.completedSteps.some(s => s.type === step)) {
      return true;
    }

    const subSteps = SUB_STEPS_MAP[step];
    const entries = subSteps.map(s => this.forms.get(s));
    return entries.some(e => e && !e.disabled && !e.valid);
  }

  private getUploadHandler(
    step: UseCaseFormStep,
    lockFile = true,
  ): RawEditorSettings['images_upload_handler'] {
    return async (blobInfo, success, failure) => {
      try {
        if (!this.useCase?.id) {
          failure('Use case must be saved first');
          return;
        }
        // Check if image was already uploaded.
        const uri = blobInfo.uri();
        if (uri && uri.startsWith('http')) {
          success(uri);
          return;
        }

        const tags = ['editor', 'image', step];
        if (lockFile) {
          tags.push(LOCKED_TAG);
        }

        const file = await this.fileService
          .uploadFile({
            file: new File([blobInfo.blob()], blobInfo.filename()),
            refIds: [this.useCase.id],
            tags,
          })
          .toPromise();

        success(getImgSrc(file.id) as string);
      } catch (e) {
        failure(e as string);
      }
    };
  }
}
