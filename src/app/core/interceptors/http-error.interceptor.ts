import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        // Client-Side Errors (Network Issues, CORS, JavaScript Errors)
         alertService.showServerErrorAlert({
          title: 'Network / Client Error',
          text: `Oops! We couldn't connect to the server. Please check your internet connection and try again.`
        });
        console.error('Client-Side Error Intercepted:', error.error.message);
      }
      else {
        switch (error.status) {
          case 400:
          console.log('BadRequest', window.location.href);
            handleBadRequest(error, alertService);
            break;
          
          case 401: //Session Expired
            // router.navigate(['/login']);
            return throwError(() => error);
            // return throwError(() => new Error(error));
            break;

          case 403: //AccessDenied
            alert('HTTP Interceptor Error 403');
            break;

          case 404: //NotFound
            alert('HTTP Interceptor Error 404');
            break;

          case 530: //HTTPError
            alert('HTTP Interceptor Error 530');
            break;

          default:
            alertService.showServerErrorAlert({ text: `Error Code: ${error.status}\nMessage: ${error.error?.errorDetail ?? error.message}`});
        }
      }
      // Optionally, you can return a default value or an empty observable
      return EMPTY; // or you can return an observable with a default value, e.g., return of({});

      // If you still want to return an observable with an error, you can use throwError
      // return throwError(() => new Error(errorMessage));
    })
  );
};

/** Handles validation errors for 400 Bad Request */
function handleBadRequest(error: HttpErrorResponse, alertService: AlertNotificationService) {
  let validationMessages = 'The request could not be processed due to an unexpected issue.';
  if (error.error && typeof error.error === 'object') {
    if(error.error.errors){
      validationMessages = `
        <ul>
          ${Object.keys(error.error.errors)
          .map(key => `<li>${key}: ${error.error.errors[key].join(', ')}</li>`
        ).join('')}
        </ul>
      `;
    }
  }
  alertService.showServerErrorAlert({
    title: 'Bad Request',
    text: validationMessages
  });
}