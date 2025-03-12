
import { Routes } from '@angular/router';

export const imsRoute: Routes = [
  {path: 'IMS/CategoryMaster/Create', loadComponent: () => import('./CategoryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'IMS/CategoryMaster/Index', loadComponent: () => import('./CategoryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'IMS/IndustryMaster/Create', loadComponent: () => import('./IndustryMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'IMS/IndustryMaster/Index', loadComponent: () => import('./IndustryMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'IMS/ProductMaster/Create', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent)},
  {path: 'IMS/ProductMaster/Index', loadComponent: () => import('./ProductMaster/index/index.component').then((m) => m.IndexComponent)},
  {path: 'IMS/ProductMaster/Edit/:id', loadComponent: () => import('./ProductMaster/create/create.component').then((m) => m.CreateComponent) },
];
