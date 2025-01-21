import { Routes } from '@angular/router';

export const authRoute: Routes = [
  {
    path: 'login', loadComponent: () => import('../../components/login/login.component').then((m) => m.LoginComponent)
    //path: 'authentication', children: [
    //  {
    //    path: 'login',
    //    loadComponent: () =>
    //      import('./login/login.component').then((m) => m.LoginComponent),
    //      title: 'Login to Zunified'
    //  }
    //]
  }
];
//@NgModule({
//  imports: [RouterModule.forChild(authRoute)],
//  exports: [RouterModule],
//})
//export class AuthenticationRoutingModule {
//  static routes = authRoute;
//}
