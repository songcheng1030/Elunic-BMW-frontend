import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { DataResponse, UserDto, UserDtoWithRoles, UserRole } from '../models';
import { ApiService } from './api-service.service';

// In place as long as we dont have proper user auth via some backend.
const AIQX_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTZhYjVmYy04NWRlLTQxNTgtOTJlYS1jZmEyNTYyYmMzMDMiLCJuYW1lIjoiaGVucmlrIHZhbiBMaW5uIiwiZ2l2ZW5fbmFtZSI6IkhlbnJpayIsImZhbWlseV9uYW1lIjoidmFuIExpbm4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJoLnZhbmxpbm4iLCJlbWFpbCI6ImhlbnJpay52YW5saW5uQGVsdW5pYy5jb20iLCJncm91cHMiOlsiL0FJUVgiXSwiaWF0IjoxNTE2MjM5MDIyfQ.9h7uY5NZscvtEKw4FmEPrY70D9O2hrzAS7P9KN_BtM8';
const REQUESTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTZhYjVmYy04NWRlLTQxNTgtOTJlYS1jZmEyNTYyYmMzMDMiLCJuYW1lIjoiaGVucmlrIHZhbiBMaW5uIiwiZ2l2ZW5fbmFtZSI6IkhlbnJpayIsImZhbWlseV9uYW1lIjoidmFuIExpbm4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJoLnZhbmxpbm4iLCJlbWFpbCI6ImhlbnJpay52YW5saW5uQGVsdW5pYy5jb20iLCJncm91cHMiOlsiL1JlcXVlc3RvciJdLCJpYXQiOjE1MTYyMzkwMjJ9.dyeM9IS5Z2zmCG04Avx1QRVTKMeY_tzpS7X7U5cQLpM';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private usersUrl = `${environment.coreServiceUrl}/v1`;

  role$ = new BehaviorSubject<UserRole>(
    (localStorage.getItem('__role') as UserRole) || 'REQUESTOR',
  );
  token$ = this.role$.pipe(
    filter(() => !environment.production),
    map(role => (role === 'AIQX_TEAM' ? AIQX_TOKEN : REQUESTOR_TOKEN)),
  );

  set role(role: UserRole) {
    localStorage.setItem('__role', role);
    this.role$.next(role);
  }

  get role() {
    return this.role$.value;
  }

  get isRequestor() {
    return this.role === 'REQUESTOR';
  }

  get isAIQXTeam() {
    return this.role === 'AIQX_TEAM';
  }

  me?: UserDtoWithRoles;

  constructor(http: HttpClient) {
    super(http);
  }

  // TODO: In place while user is not in place
  loadMe() {
    return this.http
      .get<DataResponse<UserDtoWithRoles>>(`${this.usersUrl}/meta-inf/me`)
      .subscribe(res => {
        this.me = res.data;
        if (environment.production) {
          this.role$.next(res.data.roles[0]);
        }
      });
  }

  getUser(id: string): Observable<UserDto> {
    return this.http
      .get<DataResponse<UserDto>>(`${this.usersUrl}/meta-inf/user/${id}`)
      .pipe(map(res => res.data));
  }
}
