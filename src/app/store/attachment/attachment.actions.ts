import { createAction, props } from '@ngrx/store';
import {
  AttachmentCandidate,
  AttachmentDto,
  UpdateAttachmentDto,
  UseCaseFormStep,
} from 'src/app/shared';

// load usecase attachments
export const loadUseCaseAttachments = createAction(
  '[UseCase/API] Load UseCase Attachments',
  props<{ useCaseId: string }>(),
);
export const loadedUseCaseAttachments = createAction(
  '[UseCase/API] Loaded UseCase Attachments',
  props<{ attachments: AttachmentDto<object>[] }>(),
);
export const failedLoadingUseCaseAttachments = createAction(
  '[UseCase/API] Failed loading UseCase Attachments',
  props<{ useCaseId: string; error: Error }>(),
);

// add usecase attachment
export const addUseCaseAttachment = createAction(
  '[UseCase/API] Add UseCase Attachment',
  props<{
    useCaseId: string;
    candidate: AttachmentCandidate;
    step: UseCaseFormStep;
  }>(),
);
export const addedUseCaseAttachment = createAction(
  '[UseCase/API] Added UseCase Attachment',
  props<{ attachment: AttachmentDto }>(),
);
export const failedAddingUseCaseAttachment = createAction(
  '[UseCase/API] Failed adding UseCase Attachment',
  props<{ useCaseId: string; error: Error }>(),
);

// update usecase attachment
export const updateUseCaseAttachment = createAction(
  '[UseCase/API] Update UseCase Attachment',
  props<{ attachmentId: string; dto: UpdateAttachmentDto }>(),
);
export const updatedUseCaseAttachment = createAction(
  '[UseCase/API] Updated UseCase Attachment',
  props<{ attachment: AttachmentDto }>(),
);
export const failedUpdatingUseCaseAttachment = createAction(
  '[UseCase/API] Failed updating UseCase Attachment',
  props<{ attachmentId: string; error: Error }>(),
);

// delete usecase attachment
export const deleteUseCaseAttachment = createAction(
  '[UseCase/API] Delete UseCase Attachment',
  props<{ attachment: AttachmentDto }>(),
);
export const deletedUseCaseAttachment = createAction(
  '[UseCase/API] Deleted UseCase Attachment',
  props<{ attachmentId: string }>(),
);
export const failedDeletingUseCaseAttachment = createAction(
  '[UseCase/API] Failed deleting UseCase Attachment',
  props<{ attachmentId: string; error: Error }>(),
);
