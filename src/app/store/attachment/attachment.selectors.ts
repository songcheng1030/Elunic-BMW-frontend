import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttachmentDto } from 'src/app/shared';

import { attachmentsFeatureKey, selectAll, State } from './attachment.reducer';

const featureSelector = createFeatureSelector<State>(attachmentsFeatureKey);

export const selectAttachments = createSelector(featureSelector, selectAll);

export const selectAttachment = (id: string) =>
  createSelector(selectAttachments, attachments => attachments.filter(c => c.id === id));

export const selectAttachmentOfUseCase = <T extends AttachmentDto>(useCaseId: string) =>
  createSelector(
    selectAttachments,
    attachments => attachments.filter(c => c.useCaseId === useCaseId) as T[],
  );
