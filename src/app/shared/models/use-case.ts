import { CreateDto, UpdateDto } from 'src/app/util';

import { AttachmentDto } from './attachment';
import { BaseDto } from './base';
import { USE_CASE_FORM_STEPS, UseCaseFormStep, UseCaseStepDto } from './use-case-form-object';

export const USE_CASE_STATUS = ['enabled', 'declined'] as const;
export type UseCaseStatus = typeof USE_CASE_STATUS[number];

export interface UseCaseDto extends BaseDto {
  name: string;
  plantId: string;
  building: string;
  line: string;
  position: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: UseCaseStatus;
  attachments: AttachmentDto[];
  steps: UseCaseStepDto[];
}

export type CreateUseCaseDto = Omit<CreateDto<UseCaseDto>, 'status' | 'attachments' | 'steps'>;
export type UpdateUseCaseDto = UpdateDto<CreateUseCaseDto>;

export interface UseCaseFilter {
  q?: string;
  limit?: number;
  page?: number;
  sort?: string;
  plantId?: string;
  steps?: UseCaseFormStep[];
  status?: UseCaseStatus[];
}

export function getUseCaseName(
  plantId: string,
  building: string,
  line: string,
  position: string,
  name: string,
) {
  if (plantId && building && name) {
    return `${plantId}.H${building}.B${line || 'xx'}.T${position || 'xxx'}.xxxx-${name}`;
  }
  return name;
}

export const NO_DOT_PATTERN = '^[^.]*$';

export function extractUseCaseName(name: string) {
  // eslint-disable-next-line
  const [plant, building, line, position, ...rest] = name.split('.');
  return rest.join('.').slice(5);
}

export function getCompletedSteps(useCase: Partial<UseCaseDto>): UseCaseStepDto[] {
  return (
    useCase.steps
      ?.filter(s => s.completedAt)
      .sort((a, b) => USE_CASE_FORM_STEPS.indexOf(a.type) - USE_CASE_FORM_STEPS.indexOf(b.type)) ||
    []
  );
}

export function getCurrentStep(useCase: Partial<UseCaseDto>): UseCaseFormStep {
  const steps = getCompletedSteps(useCase);
  if (!steps.length) {
    return 'initial-request';
  }

  const last = steps[steps.length - 1];
  return last.completedAt ? USE_CASE_FORM_STEPS[steps.length] || 'live' : last.type;
}

export function isUseCaseDone(useCase: Partial<UseCaseDto>) {
  return getCurrentStep(useCase) === 'live';
}
