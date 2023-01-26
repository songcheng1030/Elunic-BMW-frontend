import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { combineLatest, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { BreadCrumbSegment } from 'src/app/components/breadcrumb/breadcrumb.component';
import { ConfirmComponent } from 'src/app/modals/confirm/confirm.component';
import {
  AnimatedUseCaseStep,
  AuthService,
  DetailedRequestStep,
  getCompletedSteps,
  getCurrentStep,
  getStepColor,
  getStepLabel,
  getStepUrl,
  ImageAttachmentDto,
  InitialRequestStep,
  isUseCaseDone,
  PlantDto,
  roundDuration,
  STEPS,
  TestResultAttachmentDto,
  USE_CASE_FORM_STEPS,
  USE_CASE_STEPS_ROLES_MAP,
  UseCaseDto,
  UseCaseFormStep,
  UseCaseStepDto,
  UserRole,
  Variant,
  VariantAttachmentDto,
} from 'src/app/shared';
import { Plant, State, UseCase } from 'src/app/store';

type StepStatus = 'declined' | 'progress' | 'unknown' | 'complete';

@Component({
  selector: 'app-use-case-progress',
  templateUrl: './use-case-progress.component.html',
  styleUrls: ['./use-case-progress.component.scss'],
})
export class UseCaseProgressComponent implements OnInit, AfterViewInit {
  plant?: PlantDto;
  useCase!: UseCaseDto;
  segments: BreadCrumbSegment[] = [];
  steps = STEPS;

  variants: Variant[] = [];
  exampleAttachments: ImageAttachmentDto[] = [];
  variantAttachments: VariantAttachmentDto[] = [];
  testResultAttachments: TestResultAttachmentDto[] = [];

  @ViewChildren(MatExpansionPanel)
  expansionPanels!: QueryList<MatExpansionPanel>;

  useCase$ = this.route.data.pipe(map(data => data.useCase as UseCaseDto | undefined));
  plant$ = this.useCase$.pipe(
    switchMap(useCase =>
      useCase ? this.store.select(Plant.selectPlantById(this.useCase.plantId)) : of(undefined),
    ),
  );
  steps$ = combineLatest([this.useCase$, this.authService.role$]).pipe(
    map(([useCase, role]) => (useCase ? this.getSteps(useCase, role) : [])),
  );
  currentStepIndex$ = this.useCase$.pipe(map(useCase => this.getCurrentStepIndex(useCase)));
  currentForm$ = combineLatest([this.steps$, this.currentStepIndex$]).pipe(
    map(([steps, index]) => steps[index]?.name || steps[0].name),
  );

  getStepUrl = getStepUrl;
  getStepColor = getStepColor;
  getStepLabel = getStepLabel;

  get canDelete() {
    if (this.authService.isAIQXTeam) {
      return true;
    }
    return (
      this.authService.me?.id === this.useCase.createdBy && getCurrentStep(this.useCase) !== 'live'
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private authService: AuthService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Plant.loadPlants());

    this.route.data
      .pipe(
        tap(data => {
          this.useCase = data.useCase;

          const step = this.useCase.steps.find(s => s.type === 'detailed-request') as
            | DetailedRequestStep
            | undefined;
          this.variants = step?.form.variants || [];

          this.exampleAttachments = this.useCase.attachments.filter(
            a => a.type === 'image',
          ) as ImageAttachmentDto[];
          this.variantAttachments = this.useCase.attachments.filter(
            a => a.type === 'variant',
          ) as VariantAttachmentDto[];
          this.testResultAttachments = this.useCase.attachments.filter(
            a => a.type === 'test_result',
          ) as TestResultAttachmentDto[];

          this.segments = [
            {
              name: 'NAVIGATION.BACK_TO_USE_CASES_OVERVIEW',
              link: this.plant ? ['/plants', this.plant.id, 'use-cases'] : ['/'],
              backButton: true,
              translate: true,
            },
            {
              name: this.useCase.name,
              link: ['/', ...this.route.snapshot.url.map(u => u.path)],
            },
          ];
        }),
        switchMap(() => this.store.select(Plant.selectPlantById(this.useCase.plantId))),
      )
      .subscribe(plant => (this.plant = plant));
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const step = params.step;
      if (typeof step === 'string' && USE_CASE_FORM_STEPS.includes(step as UseCaseFormStep)) {
        const panel = this.expansionPanels.find(
          p => !!this.doc.getElementById(p._headerId)?.querySelector(`#step-${step}`),
        );

        if (panel) {
          requestAnimationFrame(() => {
            if (panel.expanded) {
              this.scrollToPanel(panel);
            } else {
              panel.open();
              panel.afterExpand
                .pipe(take(1), delay(250))
                .subscribe(() => this.scrollToPanel(panel));
            }
          });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  canEdit(form: UseCaseFormStep) {
    const role = this.authService.role;
    if (role === 'AIQX_TEAM') {
      return true;
    }
    if (this.useCase.status === 'declined') {
      return false;
    }
    return !form || USE_CASE_STEPS_ROLES_MAP[role].includes(form);
  }

  deleteUseCase() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.DELETE_USE_CASE.TITLE'),
        text: this.translate.instant('MODALS.DELETE_USE_CASE.BODY', this.useCase),
        confirmText: this.translate.instant('MODALS.DELETE_USE_CASE.CONFIRM'),
        abortText: this.translate.instant('MODALS.DELETE_USE_CASE.ABORT'),
        switchBtnColor: true,
      },
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.store.dispatch(UseCase.deleteUseCase({ id: this.useCase.id }));
        this.router.navigate(['/plants', this.useCase.plantId, 'use-cases']);
      }
    });
  }

  getStepResponsibility(step: UseCaseFormStep) {
    if (step === 'live') {
      return '';
    }

    const entry = Object.entries(USE_CASE_STEPS_ROLES_MAP).find(([, steps]) =>
      steps.includes(step),
    ) as [UserRole, UseCaseFormStep[]];

    if (entry && entry[0] === 'AIQX_TEAM') {
      return 'USER.AIQX_TEAM';
    }
    return 'USER.REQUESTOR';
  }

  getSteps(useCase: UseCaseDto, role: UserRole): AnimatedUseCaseStep[] {
    const currentStep = getCurrentStep(useCase);
    const roleSteps = USE_CASE_STEPS_ROLES_MAP[role];
    const declined = useCase.status === 'declined';

    return USE_CASE_FORM_STEPS.map<AnimatedUseCaseStep>((type, i) => {
      const step = useCase.steps.find(s => s.type === type);

      return {
        name: type,
        doneDate: step?.completedAt,
        doneBy: step?.createdBy || '',
        error: declined && type === currentStep,
        actionRoute:
          !declined &&
          type === currentStep &&
          i < USE_CASE_FORM_STEPS.length - 1 &&
          roleSteps.includes(type)
            ? this.getStepRoute(useCase.id, currentStep)
            : undefined,
      };
    });
  }

  getDescription(useCase: UseCaseDto) {
    const step = useCase.steps.find(s => s.type === 'initial-request');
    if (step) {
      return (step as InitialRequestStep).form.description || '';
    }
    return '';
  }

  getFormStep(form: UseCaseFormStep): Partial<InitialRequestStep['form']> {
    const step = this.useCase.steps.find(s => s.type === form);
    if (step) {
      return (step as InitialRequestStep).form || {};
    }
    return {};
  }

  private getStepRoute(useCaseId: string, firstIncomplete: UseCaseFormStep) {
    return ['/use-cases', 'edit', useCaseId, firstIncomplete];
  }

  private getCurrentStepIndex(useCase?: UseCaseDto) {
    const completedSteps = getCompletedSteps(useCase || {});
    return completedSteps.length;
  }

  getStepDetails(type: UseCaseFormStep): {
    status: StepStatus;
    index: number;
    responsible: boolean;
  } {
    const index = USE_CASE_FORM_STEPS.indexOf(type) + 1;
    const entry = Object.entries(USE_CASE_STEPS_ROLES_MAP).find(([, steps]) =>
      steps.includes(type),
    ) as [UserRole, UseCaseFormStep[]];
    const responsible = entry && entry[0] === this.authService.role;

    if (isUseCaseDone(this.useCase)) {
      return { status: 'complete', index, responsible };
    }

    const step = this.useCase.steps.find(s => s.type === type);
    const currentStep = getCurrentStep(this.useCase);

    if (step?.completedAt) {
      return { status: 'complete', index, responsible };
    } else if (currentStep === type) {
      if (this.useCase.status === 'declined') {
        return { status: 'declined', index, responsible };
      }
      return { status: 'progress', index, responsible: responsible && currentStep !== 'live' };
    }

    return { status: 'unknown', index, responsible };
  }

  getStatusColor(status: StepStatus) {
    return status === 'declined' ? '#d20000' : '#1a1f27';
  }

  getDuration(type: UseCaseFormStep): string {
    const index = USE_CASE_FORM_STEPS.indexOf(type);
    const step = this.useCase.steps[index] as UseCaseStepDto | undefined;
    if (step || getCurrentStep(this.useCase) === type) {
      const prevCompletedAt =
        type === 'initial-request'
          ? this.useCase.createdAt
          : this.useCase.steps[index - 1]?.completedAt;
      if (!prevCompletedAt) {
        return '-';
      }

      return `${this.getDateDiff(
        prevCompletedAt,
        step?.completedAt || new Date(),
      )} ${this.translate.instant('KPIS.DAYS')}`;
    }
    return '-';
  }

  private getDateDiff(firstDate: Date, lastDate: Date) {
    const decimalSep = this.translate.instant('COMMON.DECIMAL_SEPARATOR');
    const thousandSep = this.translate.instant('COMMON.THOUSAND_SEPARATOR');
    const days = roundDuration(Math.abs(moment(firstDate).diff(lastDate, 'minutes'))).toString();
    return days.replace(thousandSep, decimalSep);
  }

  private scrollToPanel(panel: MatExpansionPanel) {
    const el = this.doc.getElementById(panel._headerId);
    if (el) {
      // Header height offset.
      const top = el.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
