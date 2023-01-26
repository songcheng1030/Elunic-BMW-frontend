import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  private token?: string;

  constructor(private authService: AuthService) {
    this.authService.token$.subscribe(token => (this.token = token));
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
      headers: this.token
        ? new HttpHeaders({ 'X-Auth-Request-Access-Token': this.token })
        : undefined,
    });

    return next.handle(request);
  }
}
