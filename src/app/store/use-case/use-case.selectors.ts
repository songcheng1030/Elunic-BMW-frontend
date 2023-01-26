import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UseCaseDto, UseCaseFilter } from 'src/app/shared';

import { createTableSelectors } from '../table';
import { selectAll, State, useCasesFeatureKey } from './use-case.reducer';

const featureSelector = createFeatureSelector<State>(useCasesFeatureKey);

export const selectUseCases = createSelector(featureSelector, selectAll);

export const selectUseCaseById = (id: string) =>
  createSelector(selectUseCases, useCases => useCases.find(c => c.id === id));

export const selectUseCasesByPlant = (plantId: string) =>
  createSelector(selectUseCases, useCases => useCases.filter(c => c.plantId === plantId));

export const { selectTableItems, selectTableMeta } = createTableSelectors<
  UseCaseDto,
  UseCaseFilter,
  State
>(featureSelector);
