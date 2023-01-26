import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UseCaseDto } from 'src/app/shared';
import { State, UseCase } from 'src/app/store';
import { NgrxResolver } from 'src/app/util/ngrx-resolver';

@Injectable({ providedIn: 'root' })
export class UseCaseResolver extends NgrxResolver<UseCaseDto, { useCase: UseCaseDto }> {
  constructor(router: Router, store: Store<State>, actions$: Actions) {
    super(router, store, actions$, {
      idParam: 'useCaseId',
      loadAction: id => UseCase.loadUseCase({ id }),
      loadedAction: UseCase.loadedUseCase,
      failedAction: UseCase.failedLoadingUseCase,
      mapFn: ({ useCase }) => useCase,
    });
  }
}
