import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertNotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
      } else {

        if (error.status == 401) {
          router.navigate(['/login']);
          //SessionExpired_LoginPartial();
        }
        else if (error.status == 403) {
          alert('HTTP Interceptor Error 403');
          //AccessDenied_LoadPartial();
        }
        else if (error.status == 404) {
          alert('HTTP Interceptor Error 404');
          //NotFound_LoadPartial();
        }
        else if (error.status == 530) {
          alert('HTTP Interceptor Error 530');//Mujhe lagta hai iski zarurat nahi hai yeh else me already handle ho raha hai.
          //HTTPError_LoadPartial();
        }
        else {
          if (error.status == 0) {
            alertService.showServerErrorAlert({
              title: 'Network Error',
              text: 'Unable to reach the server. Please check your internet connection.'
            });
          }
          else {
            //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            //Log this message to Server and Display a user frienly message to client side.

            alertService.showServerErrorAlert({
              text: `Error Code: ${error.status}\nMessage: ${error.message}`
            });
          }
        }
      }
      
      // Optionally, you can return a default value or an empty observable
      return EMPTY; // or you can return an observable with a default value, e.g., return of({});

      // If you still want to return an observable with an error, you can use throwError
      // return throwError(() => new Error(errorMessage));
    })
  );
};
