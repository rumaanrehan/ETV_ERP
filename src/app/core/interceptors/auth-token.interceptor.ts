import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../shared/services/loader.service';
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');
  const loaderService = inject(LoaderService);
  loaderService.show();
  if (authToken) {
    const clonedreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(clonedreq).pipe(
      finalize(() => loaderService.hide())
    );
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );

  //return next(clonedreq);
};
