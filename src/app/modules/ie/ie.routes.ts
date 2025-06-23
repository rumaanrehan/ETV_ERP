
import { Routes } from '@angular/router';

export const ieRoute: Routes = [
  { path: 'ie/company-master/index', loadComponent: () => import('./settings/company-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'ie/export-order/dataview', loadComponent: () => import('./transactions/export-order/dataview/dataview.component').then((m) => m.DataviewComponent) },
  { path: 'ie/export-order/create', loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent)},
  { path: 'ie/export-order/edit/:id', loadComponent: () => import('./transactions/export-order/create/create.component').then(m => m.CreateComponent)}
];
