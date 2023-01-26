import { createAction, props } from '@ngrx/store';
import {
  CreateUseCaseDto,
  PagingResponseMeta,
  Sorting,
  UpdateUseCaseDto,
  UseCaseDto,
  UseCaseFilter,
  UseCaseFormStep,
  UseCaseFormStepTuple,
  UseCaseStatus,
} from 'src/app/shared';

export const loadUseCase = createAction('[UseCase/API] Load UseCase', props<{ id: string }>());
export const loadedUseCase = createAction(
  '[UseCase/API] Loaded UseCase',
  props<{ useCase: UseCaseDto }>(),
);
export const failedLoadingUseCase = createAction(
  '[UseCase/API] Failed loading UseCase',
  props<{ id: string; error: Error }>(),
);

export const loadUseCases = createAction(
  '[UseCase/API] Load UseCases',
  props<{ filter?: UseCaseFilter }>(),
);
export const loadedUseCases = createAction(
  '[UseCase/API] Loaded UseCases',
  props<{ useCases: UseCaseDto[] }>(),
);
export const failedLoadingUseCases = createAction(
  '[UseCase/API] Failed loading UseCases',
  props<{ error: Error }>(),
);

export const loadUseCasesTable = createAction(
  '[UseCase/API] Load UseCases table',
  props<{ tableId?: string; filter?: UseCaseFilter; sorting?: Sorting }>(),
);
export const loadedUseCasesTable = createAction(
  '[UseCase/API] Loaded UseCases table',
  props<{
    useCases: UseCaseDto[];
    tableId?: string;
    filter?: UseCaseFilter;
    paging?: Partial<PagingResponseMeta & { limit: number }>;
    sorting?: Sorting;
  }>(),
);
export const failedLoadingUseCasesTable = createAction(
  '[UseCase/API] Failed loading UseCases table',
  props<{ error: Error }>(),
);

export const removeUseCaseTable = createAction(
  '[UseCase/API] remove UseCases table',
  props<{ tableId: string }>(),
);

export const addUseCase = createAction(
  '[UseCase/API] Add UseCase',
  props<{ useCase: CreateUseCaseDto; steps: UseCaseFormStepTuple[] }>(),
);
export const addedUseCase = createAction(
  '[UseCase/API] Added UseCase',
  props<{ useCase: UseCaseDto }>(),
);
export const failedAddingUseCase = createAction(
  '[UseCase/API] Failed adding UseCase',
  props<{ error: Error }>(),
);

export const updateUseCase = createAction(
  '[UseCase/API] Update UseCase',
  props<{
    id: string;
    useCase: UpdateUseCaseDto;
    steps: UseCaseFormStepTuple[];
    silent?: boolean;
  }>(),
);
export const updatedUseCase = createAction(
  '[UseCase/API] Updated UseCase',
  props<{ useCase: UseCaseDto }>(),
);
export const failedUpdatingUseCase = createAction(
  '[UseCase/API] Failed updating UseCase',
  props<{ id: string; error: Error }>(),
);

export const completeUseCaseStep = createAction(
  '[UseCase/API] Complete UseCase step',
  props<{ id: string; step: UseCaseFormStep }>(),
);
export const completedUseCaseStep = createAction(
  '[UseCase/API] Completed UseCase step',
  props<{ useCase: UseCaseDto }>(),
);
export const failedCompletingUseCaseStep = createAction(
  '[UseCase/API] Failed completing UseCase step',
  props<{ id: string; error: Error }>(),
);

export const deleteUseCase = createAction(
  '[UseCase/API] Delete UseCase',
  props<{ id: string; tableId?: string }>(),
);
export const deletedUseCase = createAction(
  '[UseCase/API] Deleted UseCase',
  props<{ id: string }>(),
);
export const failedDeletingUseCase = createAction(
  '[UseCase/API] Failed deleting UseCase',
  props<{ id: string; error: Error }>(),
);

export const clearUseCases = createAction('[UseCase/API] Clear UseCases');

export const changeUseCaseStatus = createAction(
  '[UseCase/API] Change UseCase status',
  props<{ id: string; status: UseCaseStatus; tableId?: string }>(),
);
export const changedUseCaseStatus = createAction(
  '[UseCase/API] Changed UseCase status',
  props<{ useCase: UseCaseDto }>(),
);
export const failedChangingUseCaseStatus = createAction(
  '[UseCase/API] Failed changing UseCase status',
  props<{ id: string; error: Error }>(),
);
