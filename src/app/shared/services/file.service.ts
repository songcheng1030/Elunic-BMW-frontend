import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { CreateFileDto, DataResponse, FileDto, FileMetadataDto } from '../models';
import { ApiService } from './api-service.service';

type OptionalArray = string | string[] | undefined;

@Injectable({ providedIn: 'root' })
export class FileService extends ApiService {
  private filesUrl = `${environment.fileServiceUrl}/v1/files`;
  private uploadUrl = `${environment.fileServiceUrl}/v1/upload`;

  constructor(http: HttpClient) {
    super(http);
  }

  uploadFile(dto: CreateFileDto): Observable<FileDto> {
    const { file, ...rest } = dto;
    const fileForm = this.prepareFile(rest, file);
    return this.http
      .post<DataResponse<FileDto>>(this.uploadUrl, fileForm)
      .pipe(map(({ data }) => data));
  }

  download(id: string): Observable<File> {
    return this.http
      .get<DataResponse<File>>(`${this.filesUrl}/${id}/download`)
      .pipe(map(({ data }) => data));
  }

  getMetadata(id: string): Observable<FileMetadataDto> {
    return this.http
      .get<DataResponse<FileMetadataDto>>(`${this.filesUrl}/${id}/metadata`)
      .pipe(map(({ data }) => data));
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.filesUrl}/${id}`);
  }

  private prepareFile(changes: Partial<FileDto>, file?: File): FormData {
    const fileForm = new FormData();
    if (file) {
      fileForm.set('file', file);
    }

    const setArray = (key: string, data?: OptionalArray) => {
      if (Array.isArray(data)) {
        data.forEach(tag => fileForm.append(key, tag));
      } else if (data) {
        fileForm.set(key, data);
      }
    };

    setArray('refIds', changes.refIds);
    setArray('tags', changes.tags);

    return fileForm;
  }
}
