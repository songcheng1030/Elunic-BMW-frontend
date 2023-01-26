import { createAction, props } from '@ngrx/store';
import { PlantDto } from 'src/app/shared';

export const loadPlants = createAction('[Plant/API] Load Plants');
export const loadedPlants = createAction(
  '[Plant/API] Loaded Plants',
  props<{ plants: PlantDto[] }>(),
);
export const failedLoadingPlants = createAction(
  '[Plant/API] Failed loading Plants',
  props<{ error: Error }>(),
);
