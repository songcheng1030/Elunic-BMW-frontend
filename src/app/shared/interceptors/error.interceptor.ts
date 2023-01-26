import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(catchError(err => this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    if (err.status === 413) {
      const message = this.translate.instant('NOTIFICATIONS.FILE_SIZE_EXCEEDED');
      this.snackBar.open(message, undefined, {
        duration: 2500,
        panelClass: ['notification', 'error'],
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    } else if (err.status !== 401) {
      const message = err.error?.detail;
      this.snackBar.open(message ? message : 'Server Error', undefined, {
        duration: 2500,
        panelClass: ['notification', 'error'],
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
    return throwError(err);
  }
}
