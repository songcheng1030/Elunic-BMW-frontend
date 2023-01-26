import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, from, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pairwise,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { BreadCrumbSegment } from 'src/app/components/breadcrumb/breadcrumb.component';
import { ConfirmComponent } from 'src/app/modals/confirm/confirm.component';
import {
  UseCasesStepConfirmComponent,
  UseCasesStepConfirmModalData,
} from 'src/app/modals/use-cases-step-confirm/use-cases-step-confirm.component';
import {
  ATTACHMENT_TYPE_STEP_MAP,
  AttachmentCandidate,
  AttachmentDto,
  AuthService,
  FormStep,
  FormSubStep,
  getSubmitButtonName,
  ImageAttachmentDto,
  isCandidate,
  STEPS,
  SUB_STEPS_MAP,
  USE_CASE_FORM_STEPS,
  USE_CASE_STEPS_ROLES_MAP,
  UseCaseConfiguratorService,
  UseCaseDto,
  UseCaseFormStep,
} from 'src/app/shared';
import { Attachment, Plant, State, UseCase } from 'src/app/store';

@Component({
  selector: 'app-use-case-form-outlet',
  templateUrl: './use-case-form-outlet.component.html',
  styleUrls: ['./use-case-form-outlet.component.scss'],
})
export class UseCaseFormOutletComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private url$ = this.router.events.pipe(
    filter(ev => ev instanceof NavigationEnd),
    map(ev => (ev as NavigationEnd).urlAfterRedirects),
    startWith(this.router.url),
  );
  private useCaseId = this.route.snapshot.params['useCaseId'] as string | undefined;
  private snapshotData = this.route.snapshot.data as { useCase: UseCaseDto | undefined };
  private passGuard = false;

  useCase$ = this.route.data.pipe(
    startWith(this.route.snapshot.data),
    map(data => (data.useCase || {}) as Partial<UseCaseDto>),
  );
  plantId$ = this.route.queryParams.pipe(
    map(queryParams => queryParams['plantId'] as string | undefined),
    filter(id => !!id),
    startWith(this.snapshotData.useCase?.plantId),
  );
  segments$ = combineLatest([this.useCase$, this.plantId$.pipe(startWith(undefined))]).pipe(
    map(([useCase, plantId]) => this.getSegments(useCase, plantId)),
  );
  tabIndex$ = this.route.queryParams.pipe(
    map(params => {
      const index = Number(params['tab-index']);
      return Number.isInteger(index) && index >= 0 ? index : 0;
    }),
  );
  steps$: Observable<FormStep[]> = this.useCase$.pipe(
    map(useCase => this.getSteps(this.useCaseId, useCase)),
  );
  stepperIndex$ = this.url$.pipe(
    switchMap(url => this.steps$.pipe(map(steps => this.findStepByUrl(steps, url)))),
    startWith(0),
  );
  mainStepIndex$ = this.url$.pipe(
    map(url => this.findStepByUrl(STEPS, url)),
    startWith(0),
  );
  subSteps$ = this.mainStepIndex$.pipe(
    map(index => STEPS[index].subSteps),
    startWith([] as FormSubStep[]),
  );
  currentForm$ = this.mainStepIndex$.pipe(map(index => STEPS[index].form));
  saveDisabled$ = combineLatest([this.configurator.canSubmit$, this.currentForm$]).pipe(
    map(([value, step]) => !value || !this.configurator.canEditStep(step)),
  );
  submitDisabled$ = combineLatest([
    this.configurator.disabledSteps$,
    this.currentForm$,
    this.saveDisabled$,
  ]).pipe(
    map(
      ([steps, step, saveDisabled]) =>
        saveDisabled || steps.includes(step) || !this.configurator.canComplete(step),
    ),
    shareReplay(),
  );
  offerDisabled$ = combineLatest([this.submitDisabled$, this.configurator.offerAcceptable$]).pipe(
    map(([disabled, acceptable]) => disabled || !acceptable),
  );

  loading = false;
  getSubmitButtonName = getSubmitButtonName;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private actions$: Actions,
    public router: Router,
    public configurator: UseCaseConfiguratorService,
    public authService: AuthService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(Plant.loadPlants());
    let didInit = false;

    // Prevent creating use case without a plant.
    if (!this.useCaseId && !this.route.snapshot.queryParams['plantId']) {
      this.passGuard = true;
      this.router.navigate(['/plants']);
      return;
    }

    if (this.useCaseId) {
      this.store.dispatch(Attachment.loadUseCaseAttachments({ useCaseId: this.useCaseId }));
      if (this.snapshotData.useCase && !didInit) {
        this.configurator.init(this.snapshotData.useCase);
        didInit = true;
      }
    }

    this.plantId$
      .pipe(
        takeUntil(this.destroy$),
        filter(plantId => !this.useCaseId && !!plantId && !didInit),
      )
      .subscribe(plantId => {
        this.configurator.init({ plantId });
        didInit = true;
      });

    combineLatest([this.currentForm$.pipe(pairwise()), this.tabIndex$.pipe(pairwise())])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([[prevForm, currForm], [prevIdx, currIdx]]) =>
            prevForm === currForm && currIdx > prevIdx,
        ),
        map(([[form], [index]]) => SUB_STEPS_MAP[form][index]),
      )
      .subscribe(prev => this.configurator.markStepAsTouched(prev));

    this.configurator.showMandatoryOnly$.next(false);

    // Catch failed actions and set loading indicator to false.
    this.actions$
      .pipe(
        takeUntil(this.destroy$),
        ofType(
          UseCase.failedAddingUseCase,
          UseCase.failedCompletingUseCaseStep,
          UseCase.failedUpdatingUseCase,
          UseCase.failedDeletingUseCase,
          Attachment.failedAddingUseCaseAttachment,
          Attachment.failedUpdatingUseCaseAttachment,
          Attachment.failedDeletingUseCaseAttachment,
        ),
      )
      .subscribe(() => (this.loading = false));

    const delayMs = 100;

    combineLatest([this.tabIndex$, this.mainStepIndex$.pipe(skip(1), distinctUntilChanged())])
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        withLatestFrom(this.saveDisabled$, this.currentForm$.pipe(delay(delayMs))),
        filter(([, disabled]) => !!this.useCaseId && !disabled),
        debounceTime(delayMs),
      )
      .subscribe(([, , form]) => this.saveProgress(form, true));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.configurator.close();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return this.passGuard || !this.configurator.hasFormChanged();
  }

  saveProgress(step: UseCaseFormStep, silent = false) {
    this.loading = true;
    this.submit(undefined, undefined, silent)
      .pipe(take(1))
      .subscribe(useCase => {
        this.loading = false;
        if (!this.useCaseId) {
          this.passGuard = true;
          this.router.navigate(['/use-cases', 'edit', useCase.id, step], {
            queryParamsHandling: 'merge',
            replaceUrl: true,
            queryParams: { plantId: null },
          });
        }
      });
  }

  submitUseCase(step: UseCaseFormStep) {
    this.loading = true;
    this.submit(step)
      .pipe(take(1))
      .subscribe(useCase => {
        this.loading = false;

        const dialogRef = this.getConfirmModal(step);
        if (dialogRef) {
          dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
              this.passGuard = true;
              this.router.navigate(['/use-cases', useCase.id]);
            }
          });
        } else {
          this.passGuard = true;
          this.router.navigate(['/use-cases', useCase.id]);
        }
      });
  }

  deleteUseCase(id: string) {
    this.store
      .select(UseCase.selectUseCaseById(id))
      .pipe(
        take(1),
        filter(useCase => !!useCase),
        switchMap(useCase => {
          const dialogRef = this.dialog.open(ConfirmComponent, {
            data: {
              title: this.translate.instant('MODALS.DELETE_USE_CASE.TITLE'),
              text: this.translate.instant('MODALS.DELETE_USE_CASE.BODY', useCase as UseCaseDto),
              confirmText: this.translate.instant('MODALS.DELETE_USE_CASE.CONFIRM'),
              abortText: this.translate.instant('MODALS.DELETE_USE_CASE.ABORT'),
              switchBtnColor: true,
            },
          });
          return dialogRef.afterClosed();
        }),
      )
      .subscribe(dialogResult => {
        if (dialogResult) {
          this.loading = true;
          this.store.dispatch(UseCase.deleteUseCase({ id }));
          this.actions$.pipe(ofType(UseCase.deletedUseCase), take(1)).subscribe(res => {
            this.loading = false;
            this.passGuard = true;
            this.router.navigate(['/use-cases', res.id]);
          });
        }
      });
  }

  acceptOffer(accept: boolean) {
    this.loading = true;
    let continue$: Observable<UseCaseDto> = this.submit('order');

    if (this.useCaseId && !accept) {
      continue$ = this.awaitComplete(
        () =>
          UseCase.changeUseCaseStatus({
            id: this.useCaseId as string,
            status: 'declined',
          }),
        UseCase.changedUseCaseStatus,
      ).pipe(switchMap(() => this.submit('order', true)));
    }
    continue$
      .pipe(
        take(1),
        switchMap(useCase => {
          this.loading = false;
          const data: UseCasesStepConfirmModalData = {
            type: accept ? 'offer-accepted' : 'offer-declined',
          };
          const dialogRef = this.dialog.open(UseCasesStepConfirmComponent, {
            data,
            disableClose: true,
          });
          return dialogRef.afterClosed().pipe(map(res => [res, useCase.id] as [boolean, string]));
        }),
        take(1),
      )
      .subscribe(([dialogResult, id]) => {
        if (dialogResult) {
          this.passGuard = true;
          this.router.navigate(['/use-cases', id]);
        }
      });
  }

  getConfirmModal(
    step: UseCaseFormStep,
  ): MatDialogRef<UseCasesStepConfirmComponent | ConfirmComponent> | null {
    // Dont show modal after setup-details step.
    if (USE_CASE_FORM_STEPS.indexOf(step) >= USE_CASE_FORM_STEPS.indexOf('setup-details')) {
      return null;
    }

    if (USE_CASE_STEPS_ROLES_MAP.REQUESTOR.includes(step)) {
      return this.dialog.open(UseCasesStepConfirmComponent, {
        data: { type: step },
        disableClose: true,
      });
    }

    return this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.STEP_SUBMITTED.TITLE'),
        text: this.translate.instant('MODALS.STEP_SUBMITTED.BODY'),
        confirmText: this.translate.instant('MODALS.STEP_SUBMITTED.CONFIRM'),
        hideAbort: true,
      },
      disableClose: true,
    });
  }

  private submit(
    step?: UseCaseFormStep,
    declined = this.configurator.hasUserDeclined,
    silent = false,
  ): Observable<UseCaseDto> {
    const dto = this.configurator.getDto();
    const attachments = this.configurator.getAttachmentChanges();

    let continue$: Observable<{ useCase: UseCaseDto }>;

    if (this.useCaseId) {
      const id = this.useCaseId;
      // Upload of editor images must be done before so the urls get replaced.
      const upload$ = from(
        Promise.all(
          this.configurator
            .getEditors()
            .filter(e => e.initialized)
            .map(e => e.uploadImages()),
        ),
      );
      continue$ = upload$.pipe(
        switchMap(() => {
          const steps = this.configurator.getChangedSteps();
          return this.awaitComplete(
            () => UseCase.updateUseCase({ id, useCase: dto, steps, silent }),
            UseCase.updatedUseCase,
          );
        }),
      );
      continue$ = continue$.pipe(
        switchMap(({ useCase }) =>
          combineLatest([
            this.deleteAttachments(useCase, attachments.removed),
            this.updateAttachments(attachments.updated),
          ]).pipe(
            switchMap(() =>
              this.awaitComplete(
                () => UseCase.loadUseCase({ id: useCase.id }),
                UseCase.loadedUseCase,
              ),
            ),
            switchMap(res => this.uploadAttachments(res.useCase, attachments.added)),
            map(res => ({ useCase: res ? res.useCase : useCase })),
          ),
        ),
      );
      if (step) {
        // Dont complete the step when declined (to make sure it can be enabled later again).
        if (declined) {
          continue$ = this.awaitComplete(
            useCase =>
              UseCase.changeUseCaseStatus({
                id: useCase.id,
                status: 'declined',
              }),
            UseCase.changedUseCaseStatus,
            continue$,
          );
        } else {
          if (this.configurator.declined) {
            continue$ = this.awaitComplete(
              useCase =>
                UseCase.changeUseCaseStatus({
                  id: useCase.id,
                  status: 'enabled',
                }),
              UseCase.changedUseCaseStatus,
              continue$,
            );
          }
          continue$ = this.awaitComplete(
            () => UseCase.completeUseCaseStep({ id, step }),
            UseCase.completedUseCaseStep,
            continue$,
          );
        }
      }
    } else {
      const steps = this.configurator.getChangedSteps();
      continue$ = this.awaitComplete(
        () => UseCase.addUseCase({ useCase: dto, steps }),
        UseCase.addedUseCase,
      );
      continue$ = continue$.pipe(
        switchMap(({ useCase }) =>
          combineLatest([
            this.deleteAttachments(useCase, attachments.removed),
            this.updateAttachments(attachments.updated),
            this.uploadAttachments(useCase, attachments.added),
          ]).pipe(mapTo({ useCase })),
        ),
      );
      if (step) {
        continue$ = this.awaitComplete(
          useCase => UseCase.completeUseCaseStep({ id: useCase.id, step }),
          UseCase.completedUseCaseStep,
          continue$,
        );
      }
    }

    return continue$.pipe(
      take(1),
      switchMap(({ useCase }) =>
        this.awaitComplete(() => UseCase.loadUseCase({ id: useCase.id }), UseCase.loadedUseCase),
      ),
      map(res => res.useCase),
      tap(useCase => this.configurator.init(useCase)),
    );
  }

  private uploadAttachments(useCase: UseCaseDto, candidates: AttachmentCandidate[]) {
    if (!candidates.length) {
      return of({ useCase });
    }

    let firstImgAttachment = [...useCase.attachments]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .find(a => a.type === 'image') as ImageAttachmentDto | AttachmentCandidate | undefined;
    if (!firstImgAttachment) {
      firstImgAttachment = [...candidates].find(a => a.type === 'image');
    }

    let first: ImageAttachmentDto | undefined;
    const obs = this.actions$.pipe(
      ofType(Attachment.addedUseCaseAttachment),
      tap(({ attachment }) => {
        if (attachment.type === 'image' && !first) {
          first = attachment as ImageAttachmentDto;
        }
      }),
      skip(candidates.length - 1),
      take(1),
      switchMap(() => {
        const image =
          firstImgAttachment && !isCandidate(firstImgAttachment)
            ? firstImgAttachment.refId
            : first?.refId;

        // Only update image if it changed.
        if (useCase.image === image) {
          return of(null);
        }

        return this.awaitComplete(
          () =>
            UseCase.updateUseCase({
              id: useCase.id,
              useCase: { image },
              steps: [],
            }),
          UseCase.updatedUseCase,
        );
      }),
      take(1),
      mapTo(null),
    );

    candidates.forEach(candidate => {
      const step = ATTACHMENT_TYPE_STEP_MAP[candidate.type];
      this.store.dispatch(
        Attachment.addUseCaseAttachment({
          useCaseId: useCase.id,
          candidate,
          step,
        }),
      );
    });
    return obs;
  }

  private updateAttachments(attachments: AttachmentDto[]) {
    if (!attachments.length) {
      return of(null);
    }

    attachments.forEach(a =>
      this.store.dispatch(Attachment.updateUseCaseAttachment({ attachmentId: a.id, dto: a })),
    );
    return this.actions$.pipe(
      ofType(Attachment.updatedUseCaseAttachment),
      skip(attachments.length - 1),
      take(1),
      mapTo(null),
    );
  }

  private deleteAttachments(useCase: UseCaseDto, attachments: AttachmentDto[]) {
    if (!attachments.length) {
      return of(null);
    }

    attachments.forEach(a =>
      this.store.dispatch(Attachment.deleteUseCaseAttachment({ attachment: a })),
    );
    const updateImg = attachments.some(a => a.refId === useCase.image);
    return this.actions$.pipe(
      ofType(Attachment.deletedUseCaseAttachment),
      skip(attachments.length - 1),
      take(1),
      switchMap(() => {
        if (updateImg) {
          const firstImgAttachment = [...useCase.attachments]
            .filter(a => !attachments.some(b => a.refId === b.refId))
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .find(a => a.type === 'image') as ImageAttachmentDto | undefined;
          // Deleted attachments included the image of the use case, we remove it.
          return this.awaitComplete(
            () =>
              UseCase.updateUseCase({
                id: useCase.id,
                useCase: { image: firstImgAttachment ? firstImgAttachment.refId : '' },
                steps: [],
              }),
            UseCase.updatedUseCase,
          );
        }
        return of(null);
      }),
    );
  }

  // eslint-disable-next-line
  private getSteps(id?: string, useCase?: Partial<UseCaseDto>) {
    return STEPS.map(step => {
      const disabled = false;
      return {
        ...step,
        // Insert use case id into right segment part
        route: [...step.route.slice(0, id ? 2 : 1), id || 'new', ...step.route.slice(2)],
        disabled,
        subSteps: step.subSteps.map(s => ({ ...s, disabled })),
      };
    });
  }

  private getSegments(useCase?: Partial<UseCaseDto>, plantId?: string) {
    const segments: BreadCrumbSegment[] = [];

    if (useCase && plantId) {
      segments.push({
        name: 'NAVIGATION.BACK_TO_USE_CASES_OVERVIEW',
        link: ['/plants', plantId, 'use-cases'],
        backButton: true,
        translate: true,
      });
    } else {
      segments.push({
        name: 'NAVIGATION.BACK_TO_PLANTS_OVERVIEW',
        link: ['/plants'],
        backButton: true,
        translate: true,
      });
    }

    if (useCase && useCase.id) {
      return [
        ...segments,
        {
          name: useCase.name,
          link: ['/', ...this.route.snapshot.url.map(u => u.path)],
        },
      ];
    }
    return [
      ...segments,
      {
        name: 'NAVIGATION.NEW_USE_CASE',
        translate: true,
        link: ['/', ...this.route.snapshot.url.map(u => u.path)],
      },
    ];
  }

  private findStepByUrl(steps: FormStep[], url: string) {
    const index = steps.findIndex(step => url.includes('/' + step.form));
    return Math.max(index, 0);
  }

  private awaitComplete<T extends { useCase: UseCaseDto }>(
    fn: (useCase: UseCaseDto) => Action,
    complete: ActionCreator,
    obs$?: Observable<T>,
  ) {
    const continue$ = (obs$ || (of({}) as Observable<{ useCase: UseCaseDto }>)).pipe(
      tap(({ useCase }) => this.store.dispatch(fn(useCase))),
      switchMap(() => this.actions$),
      ofType(complete),
      take(1),
    );
    return continue$ as Observable<T>;
  }
}
