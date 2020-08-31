import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
    intercept( req: HttpRequest<any>,
               next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError ( (httpError: any) => {
                if ( httpError.status === 401)
                {
                    return throwError(httpError.statusText);
                }
                if ( httpError instanceof HttpErrorResponse ){
                    const APP_ERROR = httpError.headers.get('Application-Error');
                    if ( APP_ERROR ) {
                        return throwError(APP_ERROR);
                    }
                    const SERVER_ERROR = httpError.error;
                    let modalStateError = '';
                    if ( SERVER_ERROR.errors && typeof SERVER_ERROR.errors === 'object') {
                        for (const key in SERVER_ERROR.errors) {
                            if (SERVER_ERROR.errors[key]) {
                                modalStateError += SERVER_ERROR.errors[key] + '\n';
                            }
                        }
                    }
                    return throwError(modalStateError || SERVER_ERROR || 'Server Error');
                }
            })
        );
    }
}

export const ErrorInterceptorProvider = {
 provide: HTTP_INTERCEPTORS,
 useClass : ErrorInterceptor,
 multi : true
};
