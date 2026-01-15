import { Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';

export const homeRoute: Routes = [
  // { path: 'profile', loadComponent: () => import('../../../app/components/profile/profile/profile.component').then((m) => m.ProfileComponent) },
  // { path: 'organisation-setting', loadComponent: () => import('../../../app/components/organization-setting/organization-setting.component').then((m) => m.OrganizationSettingComponent) },
  { path: 'home', component: HomeComponent }
];
