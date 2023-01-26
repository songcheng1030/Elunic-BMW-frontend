import { CreateDto, UpdateDto } from 'src/app/util';

import { BaseDto } from './base';
import { UseCaseFormStep } from './use-case-form-object';

export type AttachmentType = 'image' | 'variant' | 'test_result';

export interface AttachmentDto<T = object, R = AttachmentType> extends BaseDto {
  refId: string;
  type: R;
  metadata: T;
  useCaseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAttachmentDto = Omit<CreateDto<AttachmentDto>, 'useCaseId'>;
export type UpdateAttachmentDto = Omit<UpdateDto<AttachmentDto>, 'useCaseId'>;

export interface ImageMetadata {
  isOK: boolean | null;
  description: string | null;
}

export type ImageAttachmentDto = AttachmentDto<ImageMetadata, 'image'>;

// eslint-disable-next-line
export type TestResultAttachmentDto = AttachmentDto<{}, 'test_result'>;

export type CreateImageAttachmentDto = Omit<CreateDto<ImageAttachmentDto>, 'useCaseId'>;
export interface ImageAttachmentCandidate extends Omit<CreateImageAttachmentDto, 'refId'> {
  file: File;
}

export type CreateTestResultAttachmentDto = Omit<CreateDto<TestResultAttachmentDto>, 'useCaseId'>;

export interface TestResultAttachmentCandidate
  extends Omit<CreateTestResultAttachmentDto, 'refId'> {
  file: File;
}
export interface VariantMetadata {
  isOK: boolean | null;
  variantIndex: number;
}
export type VariantAttachmentDto = AttachmentDto<VariantMetadata, 'variant'>;

export type CreateVariantAttachmentDto = Omit<CreateDto<VariantAttachmentDto>, 'useCaseId'>;

export interface VariantAttachmentCandidate extends Omit<CreateVariantAttachmentDto, 'refId'> {
  file: File;
}

export type AttachmentCandidate =
  | ImageAttachmentCandidate
  | VariantAttachmentCandidate
  | TestResultAttachmentCandidate;

export function isCandidate<T extends AttachmentCandidate>(input: T | AttachmentDto): input is T {
  return 'file' in input && input.file instanceof File;
}

export const ATTACHMENT_TYPE_STEP_MAP: Record<AttachmentType, UseCaseFormStep> = {
  image: 'initial-request',
  variant: 'detailed-request',
  test_result: 'approval',
};
