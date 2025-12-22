import { Routes } from '@angular/router';
import { AccessDeniedComponent } from '../../components/access-denied/access-denied.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { ServerErrorComponent } from '../../components/server-error/server-error.component';

export const mainRoute: Routes = [
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'profile', loadComponent: () => import('../../../app/components/profile/profile/profile.component').then((m) => m.ProfileComponent) },
  { path: '', loadChildren: () => import('../../modules/admin/admin.routes').then((m) => m.adminRoute) },
  { path: '', loadChildren: () => import('../../modules/ims/ims.routes').then((m) => m.imsRoute) },
  { path: '', loadChildren: () => import('../../modules/ie/ie.routes').then((m) => m.ieRoute) }
];
