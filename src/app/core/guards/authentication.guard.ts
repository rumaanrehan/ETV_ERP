import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, defaultIfEmpty, map, Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { RequestContextService } from '../services/request-context.service';
import { UserAccessLogRequest } from '../models/user';

export const AuthenticationGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const userService = inject(UserService);
  const requestContextService = inject(RequestContextService);
  const router = inject(Router);

  if (!requestContextService.AccessToken) {
    setTimeout(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    });
    return of(false);
  }

  const menuData = route.data['menu']?.split('/');
  const request: UserAccessLogRequest = {
    AreaName: menuData ? menuData[1] : '',
    ControllerName: menuData? menuData[2] : '', 
    Route: state.url
  }
  
  return userService.LogAccess(request).pipe(
    defaultIfEmpty(false), // prevent EmptyError
    map(IsAuthorized => {
      if(!!IsAuthorized){
        // REDIRECT TO ACCESS DENIED PAGE IF NOT AUTHORIZED
      }
      // if (!IsValid) {
      //   setTimeout(() => {
      //     console.log('Token is invalid or expired');
      //     router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      //   });
      //   // Token might be expired, try refreshing
      //   // return authService.refreshAccessToken().pipe(
      //   //   map(() => true),
      //   //   catchError(() => {
      //   //     router.navigateByUrl('/login');
      //   //     return of(false);
      //   //   })
      //   // );
      // }
      return IsAuthorized;
    }),
    catchError(() => {
      setTimeout(() => {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      });
      return of(false); 
    })
  );
};