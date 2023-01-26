import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UseCaseDto, UseCaseFilter } from 'src/app/shared';

import { removeTable, TableState, upsertManyAndTable } from '../table';
import * as UseCaseActions from './use-case.actions';

export const useCasesFeatureKey = 'useCases';

export interface State extends EntityState<UseCaseDto>, TableState<UseCaseDto, UseCaseFilter> {}

export const adapter: EntityAdapter<UseCaseDto> = createEntityAdapter<UseCaseDto>();

export const initialState: State = adapter.getInitialState({
  tables: {},
  tableIds: [],
});

export const reducer = createReducer(
  initialState,
  on(UseCaseActions.addedUseCase, (state, action) => adapter.addOne(action.useCase, state)),
  on(
    UseCaseActions.updatedUseCase,
    UseCaseActions.completedUseCaseStep,
    UseCaseActions.changedUseCaseStatus,
    (state, action) => adapter.upsertOne(action.useCase, state),
  ),
  on(UseCaseActions.deletedUseCase, (state, action) => adapter.removeOne(action.id, state)),
  on(UseCaseActions.loadedUseCases, (state, action) => adapter.setAll(action.useCases, state)),
  on(UseCaseActions.clearUseCases, state => adapter.removeAll(state)),
  on(UseCaseActions.loadedUseCase, (state, action) => adapter.setOne(action.useCase, state)),
  // table
  on(UseCaseActions.loadedUseCasesTable, (state, { tableId, useCases, filter, paging, sorting }) =>
    upsertManyAndTable(
      adapter.upsertMany,
      state,
      {
        items: useCases,
        filter: filter || {},
        paging: paging || {},
        sorting,
      },
      tableId,
    ),
  ),
  on(UseCaseActions.removeUseCaseTable, (state, { tableId }) =>
    removeTable<UseCaseDto, UseCaseFilter, State>(tableId, state),
  ),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
