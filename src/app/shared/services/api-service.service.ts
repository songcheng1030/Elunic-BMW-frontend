import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import httpErrors from 'http-errors';
import urlJoin from 'url-join';

import { environment } from '../../../environments/environment';

@Injectable()
export abstract class ApiService {
  constructor(protected readonly http: HttpClient) {}

  protected async get<T = unknown>(
    url: string,
    httpOptions: Record<string, unknown> = {},
  ): Promise<HttpResponse<T>> {
    return this.http
      .get<T>(urlJoin(environment.coreServiceUrl, url), {
        ...httpOptions,
        observe: 'response',
      })
      .toPromise()
      .then(response => {
        if (response.status !== 200) {
          throw httpErrors(response.status, response.statusText);
        }

        return response;
      })
      .catch((...args) => this.parseError<T>(...args));
  }

  protected async post<T = unknown>(
    url: string,
    body: unknown | null = null,
    httpOptions: Record<string, unknown> = {},
  ): Promise<HttpResponse<T>> {
    return this.http
      .post<T>(urlJoin(environment.coreServiceUrl, url), body, {
        ...httpOptions,
        observe: 'response',
      })
      .toPromise()
      .then(response => {
        if (![200, 201].includes(response.status)) {
          throw httpErrors(response.status, response.statusText);
        }

        return response;
      })
      .catch((...args) => this.parseError<T>(...args));
  }

  protected async put<T = unknown>(
    url: string,
    body: unknown | null = null,
    httpOptions: Record<string, unknown> = {},
  ): Promise<HttpResponse<T>> {
    return this.http
      .put<T>(urlJoin(environment.coreServiceUrl, url), body, {
        ...httpOptions,
        observe: 'response',
      })
      .toPromise()
      .then(response => {
        if (![200, 201].includes(response.status)) {
          throw httpErrors(response.status, response.statusText);
        }

        return response;
      })
      .catch((...args) => this.parseError<T>(...args));
  }

  protected async delete<T = unknown>(
    url: string,
    httpOptions: Record<string, unknown> = {},
  ): Promise<HttpResponse<T>> {
    return this.http
      .delete<T>(urlJoin(environment.coreServiceUrl, url), {
        ...httpOptions,
        observe: 'response',
      })
      .toPromise()
      .then(response => {
        if (![200, 201].includes(response.status)) {
          throw httpErrors(response.status, response.statusText);
        }

        return response;
      })
      .catch((...args) => this.parseError<T>(...args));
  }

  private parseError<T>(error: HttpErrorResponse): HttpResponse<T> {
    let cur = error;
    while (cur.error) {
      cur = cur.error;
    }
    throw cur;
  }

  protected addParam(
    params: HttpParams,
    key: string,
    value?: number | string | string[],
  ): HttpParams {
    if (Array.isArray(value)) {
      for (const v of value) {
        params = params.append(key, v);
      }
      return params;
    }
    if (typeof value === 'number' || typeof value === 'string') {
      return params.set(key, String(value));
    }
    return params;
  }
}
