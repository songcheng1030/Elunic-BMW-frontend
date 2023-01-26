import {
  AfterViewInit,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AuthService,
  getCompletedSteps,
  getCurrentStep,
  getStepColor,
  USE_CASE_FORM_NAME_MAP,
  USE_CASE_FORM_STEPS,
  USE_CASE_STEPS_ROLES_MAP,
  UseCaseDto,
  UseCaseFilter,
  UseCaseFormStep,
  UserRole,
} from 'src/app/shared';

import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { State, UseCase } from '../../store';
import { getThumbnailSrc } from '../../util';
import { TableDirective } from '../../util/table';
import { UseCaseTableDataSource } from '../../util/table-data-source';
import { TablePaginatorComponent } from '../table-paginator/table-paginator.component';

const TABLE_ID = 'use-cases';

@Component({
  selector: 'app-use-cases-table',
  templateUrl: './use-cases-table.component.html',
  styleUrls: ['./use-cases-table.component.scss'],
})
export class UseCasesTableComponent
  extends TableDirective<UseCaseDto>
  implements OnInit, OnDestroy, AfterViewInit
{
  private destroy$ = new Subject<void>();
  private filter$ = new BehaviorSubject<UseCaseFilter>({});

  @Input()
  set filter(filter: Pick<UseCaseFilter, 'plantId' | 'q'>) {
    this.filter$.next(filter || {});
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(TablePaginatorComponent)
  tablePaginator!: TablePaginatorComponent;

  dataSource = new UseCaseTableDataSource(this.store, TABLE_ID);

  constructor(
    protected injector: Injector,
    private store: Store<State>,
    private dialog: MatDialog,
    private translate: TranslateService,
    public authService: AuthService,
  ) {
    super(injector, [
      { name: 'image', breakpoints: [''] },
      { name: 'name', breakpoints: [''] },
      { name: 'createdBy', breakpoints: [''] },
      { name: 'updatedAt', breakpoints: [''] },
      { name: 'status', breakpoints: [''] },
      // { name: 'building', breakpoints: [''] },
      // { name: 'line', breakpoints: [''] },
      // { name: 'position', breakpoints: [''] },
      { name: 'responsible', breakpoints: [''] },
      { name: 'actions', breakpoints: [''] },
    ]);
  }

  ngOnInit() {
    this.store
      .select(UseCase.selectTableItems('use-cases'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => (this.data = data));

    this.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => this.dataSource.loadUseCases(filter));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.paginator = this.tablePaginator.paginator;
    super.ngAfterViewInit();
  }

  getThumbnailSrc = getThumbnailSrc;
  getStepColor = getStepColor;
  getCurrentStep = getCurrentStep;

  openConfirmModal(useCase: UseCaseDto): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.DELETE_USE_CASE.TITLE'),
        text: this.translate.instant('MODALS.DELETE_USE_CASE.BODY', useCase),
        confirmText: this.translate.instant('MODALS.DELETE_USE_CASE.CONFIRM'),
        abortText: this.translate.instant('MODALS.DELETE_USE_CASE.ABORT'),
        switchBtnColor: true,
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(UseCase.deleteUseCase({ id: useCase.id, tableId: TABLE_ID }));
      }
    });
  }

  getUseCaseProgress(useCase: UseCaseDto) {
    const steps = getCompletedSteps(useCase);
    return (steps.length / (USE_CASE_FORM_STEPS.length - 1)) * 100;
  }

  isDeclined(element: UseCaseDto) {
    return element.status === 'declined';
  }

  getStepLabel(element: UseCaseDto) {
    const step = getCurrentStep(element);
    const stepLabel = this.translate.instant(USE_CASE_FORM_NAME_MAP[step]);
    if (this.isDeclined(element)) {
      return `${this.translate.instant('USE_CASE.STATUS.DECLINED')} (${stepLabel})`;
    }
    return stepLabel;
  }

  getNextStepResponsibility(element: UseCaseDto) {
    const completedSteps = getCompletedSteps(element);
    if (this.isDeclined(element) || completedSteps.length === USE_CASE_FORM_STEPS.length - 1) {
      return '';
    }
    const nextStep = USE_CASE_FORM_STEPS[completedSteps.length];
    if (nextStep) {
      const entry = Object.entries(USE_CASE_STEPS_ROLES_MAP).find(([, steps]) =>
        steps.includes(nextStep),
      ) as [UserRole, UseCaseFormStep[]];
      if (entry && entry[0] === 'AIQX_TEAM') {
        return 'USER.AIQX_TEAM';
      }
    }
    return 'USER.REQUESTOR';
  }

  canEdit(element: UseCaseDto) {
    if (this.authService.isAIQXTeam) {
      return true;
    }
    if (element.status === 'declined') {
      return false;
    }
    const step = USE_CASE_FORM_STEPS[element.steps.length];
    return !element || USE_CASE_STEPS_ROLES_MAP[this.authService.role].includes(step);
  }

  canDelete(element: UseCaseDto) {
    if (this.authService.isAIQXTeam) {
      return true;
    }
    return this.authService.me?.id === element.createdBy && getCurrentStep(element) !== 'live';
  }
}
