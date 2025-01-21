import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('authToken');

  if (authToken != null) {
    return true;
  }
  else {
    router.navigateByUrl("login");
    return false;
  }
};
