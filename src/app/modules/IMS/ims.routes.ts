import { Routes } from '@angular/router';

export const imsRoute: Routes = [
  {path: 'ims/item-group-master/index', loadComponent: () => import('./ItemGroupMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/item-category-master/index', loadComponent: () => import('./ItemCategoryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/genericitem-master/index', loadComponent: () => import('./GenericItemMaster/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/product-master/index', loadComponent: () => import('./ProductMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/uom-master/index', loadComponent: () => import('./UOMMaster/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/manufacturer-master/index', loadComponent: () => import('./Manufacturer-Master/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/hsn-sac-master/index', loadComponent: () => import('./HsnSacMaster/index/index.component').then((m) => m.IndexComponent) },
];
