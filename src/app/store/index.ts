import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from '../../environments/environment';
import { AppEffects } from './app.effects';
import * as Attachment from './attachment';
import * as Plant from './plant';
import * as UseCase from './use-case';

export interface State {
  [UseCase.useCasesFeatureKey]: UseCase.State;
  [Plant.plantsFeatureKey]: Plant.State;
  [Attachment.attachmentsFeatureKey]: Attachment.State;
}

export const reducers: ActionReducerMap<State> = {
  [UseCase.useCasesFeatureKey]: UseCase.reducer,
  [Plant.plantsFeatureKey]: Plant.reducer,
  [Attachment.attachmentsFeatureKey]: Attachment.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const appEffects = [
  AppEffects,
  UseCase.UseCaseEffects,
  Plant.PlantEffects,
  Attachment.AttachmentEffects,
];

export { Attachment, Plant, UseCase };
