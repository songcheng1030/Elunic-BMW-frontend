import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PlantDto } from 'src/app/shared';

import * as PlantActions from './plant.actions';

export const plantsFeatureKey = 'plants';

export type State = EntityState<PlantDto>;

export const adapter: EntityAdapter<PlantDto> = createEntityAdapter<PlantDto>();

export const initialState: State = adapter.getInitialState({
  tables: {},
  tableIds: [],
});

export const reducer = createReducer(
  initialState,
  on(PlantActions.loadedPlants, (state, action) => adapter.setAll(action.plants, state)),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
