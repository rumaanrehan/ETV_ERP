import { Routes } from '@angular/router';

export const mainRoute: Routes = [
  { path: '', loadChildren: () => import('../../modules/admin/admin.routes').then((m) => m.adminRoute) },
  { path: '', loadChildren: () => import('../../modules/ims/ims.routes').then((m) => m.imsRoute) },
  { path: '', loadChildren: () => import('../../modules/ie/ie.routes').then((m) => m.ieRoute) }
];
