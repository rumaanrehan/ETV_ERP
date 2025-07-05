import { Routes } from '@angular/router';

export const imsRoute: Routes = [
  {path: 'ims/item-group-master/index', loadComponent: () => import('./ItemGroupMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/item-category-master/create', loadComponent: () => import('./ItemCategoryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/item-category-master/index', loadComponent: () => import('./ItemCategoryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/industry-master/create', loadComponent: () => import('./IndustryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/industry-master/index', loadComponent: () => import('./IndustryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/product-master/create', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'ims/product-master/index', loadComponent: () => import('./ProductMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'ims/product-master/edit/:id', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent) },

  // {path: 'ims/manufacturer-master/create', loadComponent: () => import('./Manufacturer-Master/create/create.component').then((m) => m.CreateComponent) },
  {path: 'ims/manufacturer-master/index', loadComponent: () => import('./Manufacturer-Master/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/genericitem-master/index', loadComponent: () => import('./GenericItemMaster/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/uom-master/create', loadComponent: () => import('./UOMMaster/create/create.component').then((m) => m.CreateComponent) },
  {path: 'ims/uom-master/index', loadComponent: () => import('./UOMMaster/index/index.component').then((m) => m.IndexComponent) },
  {path: 'ims/store-master/create', loadComponent: () => import('./StoreMaster/create/create.component').then((m) => m.CreateComponent) },  
  {path: 'ims/store-master/index', loadComponent: () => import('./StoreMaster/index/index.component').then((m) => m.IndexComponent) },
];
