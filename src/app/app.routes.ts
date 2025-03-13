// import { CreateProductMasterComponent } from './components/product-master/product-master.component';
import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';
import { HomeLayoutComponent } from './shared/layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './shared/layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { authRoute } from './shared/routes/auth.routes';
import { homeRoute } from './shared/routes/home.routes';
import { mainRoute } from './shared/routes/main.routes';
import { CreateComponent } from './components/Manufacturer-Master/create/create.component';
import { IndexComponent } from './components/Manufacturer-Master/index/index.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: '', loadChildren: () => import('./shared/routes/auth.routes').then(m => m.AuthenticationRoutingModule) },
  { path: '', component: LoginLayoutComponent, children: authRoute },
  // { path: '', component: HomeLayoutComponent, children: homeRoute, canActivate: [authGuard] },
  { path: '', component: HomeLayoutComponent, children: homeRoute },
  // { path: '', component: MainLayoutComponent, children: mainRoute, canActivate: [authGuard] },
  { path: '', component: MainLayoutComponent, children: mainRoute },
];