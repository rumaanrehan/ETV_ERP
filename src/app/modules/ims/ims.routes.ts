import { Routes } from '@angular/router';

export const imsRoute: Routes = [
  {path: 'ims/item-group-master/index', loadComponent: () => import('./settings/item-group-master/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/item-category-master/index', loadComponent: () => import('./settings/item-category-master/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/generic-master/index', loadComponent: () => import('./settings/generic-master/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/product-master/index', loadComponent: () => import('./settings/product-master/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/product-master/edit/:id', loadComponent: () => import('./settings/product-master/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/uom-master/index', loadComponent: () => import('./settings/uom-master/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/manufacturer-master/index', loadComponent: () => import('./settings/manufacturer-master/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/hsn-sac-master/index', loadComponent: () => import('./settings/hsn-code-master/index/index.component').then((m) => m.IndexComponent) },
];
