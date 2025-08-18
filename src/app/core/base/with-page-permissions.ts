import { computed, inject, Signal } from '@angular/core';
import { UserRolePermissionsService } from '../services/user-role-permissions.service';
import { UserPagePermissions } from '../models/user';

export abstract class WithPagePermissions {
  protected permissionService = inject(UserRolePermissionsService);
  permissions!: Signal<UserPagePermissions>;

  constructor(pageKey: string) {
    this.permissions = computed(() => this.permissionService.permissions()?.[pageKey] || {});
  }

  get canCreate() {
    return this.permissions()?.CanCreate ?? false;
  }

  get canRead() {
    return this.permissions()?.CanRead ?? false;
  }

  get canUpdate() {
    return this.permissions()?.CanUpdate ?? false;
  }

  get canDelete() {
    return this.permissions()?.CanDelete ?? false;
  }
}