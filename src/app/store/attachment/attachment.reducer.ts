import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { AttachmentDto } from 'src/app/shared';

import * as AttachmentActions from './attachment.actions';

export const attachmentsFeatureKey = 'attachments';

export type State = EntityState<AttachmentDto<object>>;

export const adapter: EntityAdapter<AttachmentDto<object>> =
  createEntityAdapter<AttachmentDto<object>>();
export const initialState: State = adapter.getInitialState({
  tables: {},
  tableIds: [],
});
export const reducer = createReducer(
  initialState,
  on(AttachmentActions.loadedUseCaseAttachments, (state, action) =>
    adapter.setAll(action.attachments, state),
  ),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
