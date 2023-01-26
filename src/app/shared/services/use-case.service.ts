import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
  AttachmentDto,
  CreateAttachmentDto,
  CreateUseCaseDto,
  DataResponse,
  PagingResponseMeta,
  PlantDto,
  Sorting,
  StatusKpiDto,
  UpdateAttachmentDto,
  UpdateUseCaseDto,
  USE_CASE_FORM_STEPS,
  UseCaseDto,
  UseCaseFilter,
  UseCaseFormStep,
  UseCaseFormStepTuple,
  UseCaseStatus,
  UseCaseStepDto,
} from '../models';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class UseCaseService extends ApiService {
  private useCasesUrl = `${environment.coreServiceUrl}/v1/use-cases`;
  private plantsUrl = `${environment.coreServiceUrl}/v1/plants`;
  private attachmentsUrl = `${environment.coreServiceUrl}/v1/attachments`;
  private kpiUrl = `${environment.coreServiceUrl}/v1/kpis`;

  constructor(http: HttpClient) {
    super(http);
  }

  getPlants(): Observable<PlantDto[]> {
    return this.http.get<DataResponse<PlantDto[]>>(this.plantsUrl).pipe(map(({ data }) => data));
  }

  getUseCase(id: string): Observable<UseCaseDto> {
    return this.http
      .get<DataResponse<UseCaseDto>>(`${this.useCasesUrl}/${id}`)
      .pipe(map(({ data }) => this.mapUseCase(data)));
  }

  getUseCases(
    filter: UseCaseFilter = {},
    sorting?: Sorting,
  ): Observable<{ useCases: UseCaseDto[]; meta: PagingResponseMeta }> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => (params = this.addParam(params, key, value)));
    if (sorting) {
      params = params.set('order', sorting.join(';'));
    }

    return this.http
      .get<{ data: UseCaseDto[]; meta: PagingResponseMeta }>(this.useCasesUrl, { params })
      .pipe(map(res => ({ useCases: res.data.map(d => this.mapUseCase(d)), meta: res.meta })));
  }

  getPlantKpis(plantId: string): Observable<StatusKpiDto> {
    return this.http
      .get<DataResponse<StatusKpiDto>>(`${this.kpiUrl}/plants/${plantId}`)
      .pipe(map(({ data }) => data));
  }

  getUseCaseKpis(id: string): Observable<StatusKpiDto> {
    return this.http
      .get<DataResponse<StatusKpiDto>>(`${this.kpiUrl}/use-cases/${id}`)
      .pipe(map(({ data }) => data));
  }

  createUseCase(dto: CreateUseCaseDto, steps: UseCaseFormStepTuple[]): Observable<UseCaseDto> {
    const obs$ = this.http
      .post<DataResponse<UseCaseDto>>(this.useCasesUrl, dto)
      .pipe(map(({ data }) => this.mapUseCase(data)));

    if (!steps.length) {
      return obs$;
    }

    return obs$.pipe(
      switchMap(({ id }) =>
        forkJoin(steps.map(([step, form]) => this.updateUseCaseStep(id, step, form))).pipe(
          switchMap(() => this.getUseCase(id)),
        ),
      ),
    );
  }

  updateUseCase(
    id: string,
    dto: UpdateUseCaseDto,
    steps: UseCaseFormStepTuple[],
  ): Observable<UseCaseDto> {
    const obs$ = this.http
      .put<DataResponse<UseCaseDto>>(`${this.useCasesUrl}/${id}`, dto)
      .pipe(map(({ data }) => this.mapUseCase(data)));

    if (!steps.length) {
      return obs$;
    }

    return obs$.pipe(
      switchMap(res =>
        forkJoin(steps.map(([step, form]) => this.updateUseCaseStep(res.id, step, form))).pipe(
          switchMap(() => this.getUseCase(res.id)),
        ),
      ),
    );
  }

  updateUseCaseStep(
    id: string,
    step: UseCaseFormStep,
    dto: UseCaseStepDto['form'],
  ): Observable<UseCaseDto> {
    return this.http
      .put<DataResponse<UseCaseDto>>(`${this.useCasesUrl}/${id}/step/${step}`, dto)
      .pipe(map(({ data }) => this.mapUseCase(data)));
  }

  completeUseCaseStep(id: string, step: UseCaseFormStep): Observable<UseCaseDto> {
    return this.http
      .post<DataResponse<UseCaseDto>>(`${this.useCasesUrl}/${id}/step/${step}/complete`, {})
      .pipe(map(({ data }) => this.mapUseCase(data)));
  }

  deleteUseCase(id: string) {
    return this.http.delete(`${this.useCasesUrl}/${id}`);
  }

  getUseCaseAttachments(useCaseId: string): Observable<AttachmentDto[]> {
    return this.http
      .get<DataResponse<AttachmentDto[]>>(`${this.useCasesUrl}/${useCaseId}/attachments`)
      .pipe(map(({ data }) => data.map(d => this.mapAttachment(d))));
  }

  addUseCaseAttachment(useCaseId: string, dto: CreateAttachmentDto): Observable<AttachmentDto> {
    return this.http
      .post<DataResponse<AttachmentDto>>(`${this.useCasesUrl}/${useCaseId}/attachments`, dto)
      .pipe(map(({ data }) => this.mapAttachment(data)));
  }

  updateUseCaseAttachment(id: string, dto: UpdateAttachmentDto): Observable<AttachmentDto> {
    return this.http
      .put<DataResponse<AttachmentDto>>(`${this.attachmentsUrl}/${id}`, dto)
      .pipe(map(({ data }) => this.mapAttachment(data)));
  }

  deleteUseCaseAttachment(id: string): Observable<void> {
    // eslint-disable-next-line  @typescript-eslint/no-empty-function
    return this.http.delete(`${this.attachmentsUrl}/${id}`).pipe(map(() => {}));
  }

  setUseCaseStatus(id: string, status: UseCaseStatus): Observable<UseCaseDto> {
    const url = `${this.useCasesUrl}/${id}/${status === 'declined' ? 'decline' : 'enable'}`;
    return this.http
      .post<DataResponse<UseCaseDto>>(url, {})
      .pipe(map(({ data }) => this.mapUseCase(data)));
  }

  // TODO: Temporary because some backend bug
  private mapUseCase(dto: UseCaseDto): UseCaseDto {
    return {
      ...dto,
      attachments: dto.attachments.map(a => this.mapAttachment(a)),
      steps: dto.steps
        .map(s => ({
          ...s,
          completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
          form: typeof s.form === 'string' ? JSON.parse(s.form) : s.form,
        }))
        .sort((a, b) => USE_CASE_FORM_STEPS.indexOf(a.type) - USE_CASE_FORM_STEPS.indexOf(b.type)),
    };
  }

  private mapAttachment(dto: AttachmentDto): AttachmentDto {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }
}
