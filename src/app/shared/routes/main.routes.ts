import { Routes } from '@angular/router';

export const mainRoute: Routes = [
  { path: '', loadChildren: () => import('../../modules/admin/admin.routes').then((m) => m.adminRoute) },
  { path: '', loadChildren: () => import('../../modules/IMS/ims.routes').then((m) => m.imsRoute) }
];
