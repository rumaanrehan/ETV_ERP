import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserRolePermissionsService } from '../services/user-role-permissions.service';

export const AuthorizationGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {

  const userRolePermissionsService = inject(UserRolePermissionsService);
  const router = inject(Router);

  const menu = route.data['menu'];
  const requiredPermission = route.data['permission'];

  const authorizeResponse = await userRolePermissionsService.authorize(menu, requiredPermission);

  if (authorizeResponse === 'authorized') {
    return true;
  }
  else {
    router.navigate([authorizeResponse === 'unauthorized' ? '/access-denied' : '/not-found']);
    return false;
  }
};