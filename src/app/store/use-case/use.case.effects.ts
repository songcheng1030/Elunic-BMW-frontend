import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { UseCaseService } from 'src/app/shared';

import { State } from '..';
import * as UseCaseActions from './use-case.actions';
import * as UseCaseSelectors from './use-case.selectors';

@Injectable()
export class UseCaseEffects {
  loadUseCase = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.loadUseCase),
      mergeMap(({ id }) =>
        this.useCaseService.getUseCase(id).pipe(
          map(useCase => UseCaseActions.loadedUseCase({ useCase })),
          catchError(error => of(UseCaseActions.failedLoadingUseCase({ id, error }))),
        ),
      ),
    ),
  );

  loadUseCases = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.loadUseCases),
      mergeMap(({ filter }) => this.useCaseService.getUseCases(filter)),
      map(({ useCases }) => UseCaseActions.loadedUseCases({ useCases })),
      catchError(error => of(UseCaseActions.failedLoadingUseCases({ error }))),
    ),
  );

  loadUseCasesTable = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.loadUseCasesTable),
      mergeMap(({ tableId, filter, sorting }) =>
        this.store.select(UseCaseSelectors.selectTableMeta(tableId)).pipe(
          take(1),
          switchMap(meta =>
            this.useCaseService.getUseCases(filter || meta.filter, sorting || meta.sorting).pipe(
              map(res =>
                UseCaseActions.loadedUseCasesTable({
                  tableId,
                  useCases: res.useCases,
                  filter: filter || meta.filter,
                  paging: {
                    ...res.meta,
                    limit: filter ? filter.limit || meta.paging.limit : meta.paging.limit,
                  },
                  sorting: sorting || meta.sorting,
                }),
              ),
              catchError(error => of(UseCaseActions.failedLoadingUseCasesTable({ error }))),
            ),
          ),
        ),
      ),
    ),
  );

  createUseCase = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.addUseCase),
      mergeMap(({ useCase, steps }) =>
        this.useCaseService.createUseCase(useCase, steps).pipe(
          map(res => {
            this.showSuccessSnackbar('NOTIFICATIONS.USE_CASE_CREATED');
            return UseCaseActions.addedUseCase({ useCase: res });
          }),
          catchError(error => of(UseCaseActions.failedAddingUseCase({ error }))),
        ),
      ),
    ),
  );

  updateUseCase = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.updateUseCase),
      mergeMap(({ id, useCase, steps, silent }) =>
        this.useCaseService.updateUseCase(id, useCase, steps).pipe(
          map(res => {
            if (!silent) {
              this.showSuccessSnackbar('NOTIFICATIONS.USE_CASE_UPDATED');
            }
            return UseCaseActions.updatedUseCase({ useCase: res });
          }),
          catchError(error => of(UseCaseActions.failedUpdatingUseCase({ id, error }))),
        ),
      ),
    ),
  );

  completeUseCaseStep = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.completeUseCaseStep),
      mergeMap(({ id, step }) =>
        this.useCaseService.completeUseCaseStep(id, step).pipe(
          map(res => {
            this.showSuccessSnackbar('NOTIFICATIONS.USE_CASE_STEP_COMPLETED');
            return UseCaseActions.completedUseCaseStep({ useCase: res });
          }),
          catchError(error => of(UseCaseActions.failedCompletingUseCaseStep({ id, error }))),
        ),
      ),
    ),
  );

  deleteUseCase = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.deleteUseCase),
      mergeMap(({ id, tableId }) =>
        this.useCaseService.deleteUseCase(id).pipe(
          switchMap(() => {
            this.showSuccessSnackbar('NOTIFICATIONS.USE_CASE_DELETED');
            const arr = [UseCaseActions.deletedUseCase({ id })];
            return tableId ? [...arr, UseCaseActions.loadUseCasesTable({ tableId })] : arr;
          }),
          catchError(error => of(UseCaseActions.failedDeletingUseCase({ id, error }))),
        ),
      ),
    ),
  );

  setUseCaseStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(UseCaseActions.changeUseCaseStatus),
      mergeMap(({ id, status, tableId }) =>
        this.useCaseService.setUseCaseStatus(id, status).pipe(
          switchMap(res => {
            this.showSuccessSnackbar('NOTIFICATIONS.USE_CASE_STATUS_CHANGED');
            const arr = [UseCaseActions.changedUseCaseStatus({ useCase: res })];
            return tableId ? [...arr, UseCaseActions.loadUseCasesTable({ tableId })] : arr;
          }),
          catchError(error => of(UseCaseActions.failedChangingUseCaseStatus({ id, error }))),
        ),
      ),
    ),
  );

  private showSuccessSnackbar(msg: string): void {
    const message = this.translate.instant(msg);
    this.snackBar.dismiss();
    this.snackBar.open(message, undefined, {
      duration: 2500,
      panelClass: ['notification', 'success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private useCaseService: UseCaseService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {}
}
