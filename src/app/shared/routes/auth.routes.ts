import { Routes } from '@angular/router';

export const authRoute: Routes = [
  {
    path: 'login', loadComponent: () => import('../../components/login/login.component').then((m) => m.LoginComponent)
  },
];