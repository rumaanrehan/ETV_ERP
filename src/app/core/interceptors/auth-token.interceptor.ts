import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { LoaderService } from '../../shared/services/loader.service';
import { RequestContextService } from '../services/request-context.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const requestContextService = inject(RequestContextService);

  loaderService.show();
  const authToken = requestContextService.AccessToken;

  // Convert async fingerprint Promise to Observable
  return from(requestContextService.GetDeviceFingerprint()).pipe(
    switchMap(deviceFingerprint => {
      const headers: Record<string, string> = {};

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      if (deviceFingerprint) {
        headers['X-Device-Fingerprint'] = deviceFingerprint;
      }

      const clonedReq = req.clone({
        setHeaders: headers
      });

      return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            if (!requestContextService.isRefreshing) {
              requestContextService.ClearTokens();
              requestContextService.isRefreshing = true;
              requestContextService.refreshTokenSubject.next(null);

              // Notify subscribers that a token refresh is in progress
              return requestContextService.RefreshAccessToken().pipe(
                switchMap(newToken => {
                  if (newToken) {
                    const retryReq = req.clone({
                      setHeaders: {
                        ...headers,
                        Authorization: `Bearer ${newToken}`
                      }
                    });
                    return next(retryReq);
                  }
                  else {
                    return throwError(() => error);
                  }
                })
              );
            }
            else {
              // Wait for the token to be refreshed and retry the request
              return requestContextService.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(newToken => {
                  const retryReq = req.clone({
                    setHeaders: {
                      ...headers,
                      Authorization: `Bearer ${newToken!}`
                    }
                  });
                  return next(retryReq);
                })
              );
            }
          }
          return throwError(() => error);
        }),
        finalize(() => loaderService.hide())
      );
    })
  );
};
