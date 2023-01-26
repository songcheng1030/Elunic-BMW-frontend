import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { DataResponse, SearchResultDto } from '../models';
import { ApiService } from './api-service.service';

@Injectable({ providedIn: 'root' })
export class SearchService extends ApiService {
  private searchUrl = `${environment.coreServiceUrl}/v1/search`;

  constructor(http: HttpClient) {
    super(http);
  }

  search(q: string) {
    return this.http
      .get<DataResponse<SearchResultDto[]>>(this.searchUrl, { params: { q } })
      .pipe(map(({ data }) => data));
  }
}
