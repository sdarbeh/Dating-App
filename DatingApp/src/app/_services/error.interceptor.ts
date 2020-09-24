import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          return throwError(err.statusText);
        }
        if (err instanceof HttpErrorResponse) {
          const applicationError = err.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }
          const serveError = err.error;
          let modalStateErrors = '';
          if (serveError.errors && typeof serveError.errors === 'object') {
            for (const key in serveError.errors) {
              if (serveError.errors[key]) {
                modalStateErrors += serveError.errors[key] + '\n';
              }
            }
          }
          return throwError(modalStateErrors || serveError || 'Server Error');
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
