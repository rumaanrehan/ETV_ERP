
import { Routes } from '@angular/router';

export const ieRoute: Routes = [
  { path: 'ie/company-master/index', loadComponent: () => import('./settings/company-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'ie/port-master/index', loadComponent: () => import('./settings/port-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'ie/export-order-payment/index', loadComponent: () => import('./transactions/export-order-payment/index/index.component').then((m) => m.IndexComponent) },
  { path: 'ie/export-order/dataview', loadComponent: () => import('./transactions/export-order/dataview/dataview.component').then((m) => m.DataviewComponent) },
  { path: 'ie/export-order/create', loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent)},
  { path: 'ie/export-order/edit/:id', loadComponent: () => import('./transactions/export-order/create/create.component').then(m => m.CreateComponent)},
  { path: 'ie/document-type-master/index', loadComponent: () => import('./settings/document-type-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'ie/document-mapping/index', loadComponent: () => import('./transactions/export-order-document-mapping/index/index.component').then((m) => m.IndexComponent) },
];