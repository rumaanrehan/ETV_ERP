
import { Routes } from '@angular/router';

export const imsRoute: Routes = [
  {path: 'ims/category-master/create', loadComponent: () => import('./CategoryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/category-master/index', loadComponent: () => import('./CategoryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/industry-master/create', loadComponent: () => import('./IndustryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/industry-master/index', loadComponent: () => import('./IndustryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/product-master/create', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/product-master/index', loadComponent: () => import('./ProductMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/product-master/edit/:id', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent) },

  {path: 'ims/uom-master/create', loadComponent: () => import('./UOMMaster/create/create.component').then((m) => m.CreateComponent) },
  {path: 'ims/uom-master/index', loadComponent: () => import('./UOMMaster/index/index.component').then((m) => m.IndexComponent) },
];
