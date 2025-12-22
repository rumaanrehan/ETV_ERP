import { Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';

export const homeRoute: Routes = [
  { path: 'profile', loadComponent: () => import('../../../app/components/profile/profile/profile.component').then((m) => m.ProfileComponent) },
  { path: 'home', component: HomeComponent }
];
