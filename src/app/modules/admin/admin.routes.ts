import { Routes } from '@angular/router';
import { AuthorizationGuard } from '../../core/guards/authorization.guard';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';

export const adminRoute: Routes = [
  {
    path: 'admin',
    data: {
      breadcrumb: 'Admin',
      breadcrumbPath: '/admin/home'
    },
    children: [
      //Home
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
        canActivate: [AuthenticationGuard],
        data: {
          breadcrumb: 'Home'
        }
      },

      // Settings
      {
        path: '',
        data: {
          breadcrumb: 'Settings'
        },
        children: [
          {
            path: 'module-master',
            loadComponent: () => import('./settings/module-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/ModuleMaster',
              breadcrumb: 'Module Master'
            }
          },
          {
            path: 'menu-master',
            loadComponent: () => import('./settings/menu-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/MenuMaster',
              breadcrumb: 'Menu Master'
            }
          },
          {
            path: 'number-format',
            loadComponent: () => import('./settings/number-format/index/index.component').then((m) => m.IndexComponent),
            // canActivate: [AuthenticationGuard, AuthorizationGuard],
            // data: {
            //   permission: 'CanRead',
            //   menu: 'Admin/NumberFormat',
            //   breadcrumb: 'Number Format'
            // }
          },
          {
            path: 'role-master',
            loadComponent: () => import('./settings/role-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/RoleMaster',
              breadcrumb: 'Role Master'
            }
          },
          {
            path: 'role-permission',
            loadComponent: () => import('./settings/role-permission/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/RoleMaster',
              breadcrumb: 'Role Master'
            }
          },
          {
            path: 'tax-slab-master',
            loadComponent: () => import('./settings/tax-slab-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/TaxSlabMaster',
              breadcrumb: 'Tax Slab Master'
            }
          },
          {
            path: 'currency-master',
            loadComponent: () => import('./settings/currency-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/CurrencyMaster',
              breadcrumb: 'Currency Master'
            }
          },
          {
            path: 'holiday-master',
            loadComponent: () => import('./settings/HolidayMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/HolidayMaster',
              breadcrumb: 'Holiday Master'
            }
          },
          {
            path: 'state-master',
            loadComponent: () => import('./settings/state-master/index/index.component').then((m) => m.IndexComponent),
          },
          {
            path: 'designation-master',
            loadComponent: () => import('./settings/designation-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/DesignationMaster',
              breadcrumb: 'Designation Master'
            }
          },
          {
            path: 'employee-type-master',
            loadComponent: () => import('./settings/employee-type-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/EmployeeTypeMaster',
              breadcrumb: 'Employee Type Master'
            }
          },
          {
            path: 'employee-registration',
            loadComponent: () => import('./transactions/employee-registration/index/index.component').then((m) => m.IndexComponent)
            // canActivate: [AuthenticationGuard, AuthorizationGuard],
            // data: {
            //   permission: 'CanRead',
            //   menu: 'Admin/EmployeeTypeMaster',
            //   breadcrumb: 'Employee Type Master'
            // }
          },
          {
            path: 'employee-registration/create',
            loadComponent: () => import('./transactions/employee-registration/create/create.component').then((m) => m.CreateComponent)
            // canActivate: [AuthenticationGuard, AuthorizationGuard],
            // data: {
            //   permission: 'CanRead',
            //   menu: 'Admin/EmployeeTypeMaster',
            //   breadcrumb: 'Employee Type Master'
            // }
          },
          {
            path: 'employee-registration/edit/:id',
            loadComponent: () => import('./transactions/employee-registration/create/create.component').then((m) => m.CreateComponent)
            // canActivate: [AuthenticationGuard, AuthorizationGuard],
            // data: {
            //   permission: 'CanRead',
            //   menu: 'Admin/EmployeeTypeMaster',
            //   breadcrumb: 'Employee Type Master'
            // }
          }
        ]
      }
    ]
  }
];
