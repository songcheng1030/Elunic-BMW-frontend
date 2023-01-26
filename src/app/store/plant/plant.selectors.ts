import { createFeatureSelector, createSelector } from '@ngrx/store';

import { plantsFeatureKey, selectAll, State } from './plant.reducer';

const featureSelector = createFeatureSelector<State>(plantsFeatureKey);

export const selectPlants = createSelector(featureSelector, selectAll);

export const selectPlantById = (id: string) =>
  createSelector(selectPlants, plants => plants.find(p => p.id === id));
