import { Routes } from '@angular/router';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';
import { AuthorizationGuard } from '../../core/guards/authorization.guard';

export const imsRoute: Routes = [
  {
    path: 'ims',
    data: {
      breadcrumb: 'IMS',
      breadcrumbPath: '/ims/home'
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

      //Transactions
      // {
      //   path: '',
      //   data: {
      //     breadcrumb: 'Transactions'
      //   },
      //   children: [
      //     {
      //       path: 'export-order',
      //       canActivateChild: [AuthenticationGuard, AuthorizationGuard],
      //       data: {
      //         breadcrumb: 'Export Order'
      //       },
      //       children: [
      //         {
      //           path: 'index',
      //           loadComponent: () => import('./transactions/export-order/dataview/dataview.component').then((m) => m.DataviewComponent),
      //           data: {
      //             permission: 'CanRead',
      //             menu: 'IE/ExportOrder'
      //           }
      //         },
      //         {
      //           path: 'create',
      //           loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
      //           data: {
      //             permission: 'CanCreate',
      //             menu: 'IE/ExportOrder',
      //             breadcrumb: 'Create'
      //           }
      //         },
      //         {
      //           path: 'edit/:id',
      //           loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
      //           data: {
      //             permission: 'CanUpdate',
      //             menu: 'IE/ExportOrder',
      //             breadcrumb: 'Edit'
      //           }
      //         }
      //       ]
      //     },
      //     {
      //       path: 'import-order',
      //       canActivateChild: [AuthenticationGuard, AuthorizationGuard],
      //       data: {
      //         breadcrumb: 'Import Order'
      //       },
      //       children: [
      //         {
      //           path: 'index',
      //           loadComponent: () => import('./transactions/import-order/dataview/dataview.component').then((m) => m.DataviewComponent),
      //           data: {
      //             permission: 'CanRead',
      //             menu: 'IE/ImportOrder'
      //           }
      //         },
      //         {
      //           path: 'create',
      //           loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
      //           data: {
      //             permission: 'CanCreate',
      //             menu: 'IE/ImportOrder',
      //             breadcrumb: 'Create'
      //           }
      //         },
      //         {
      //           path: 'edit/:id',
      //           loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
      //           data: {
      //             permission: 'CanUpdate',
      //             menu: 'IE/ImportOrder',
      //             breadcrumb: 'Edit'
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // },

      //Settings
      {
        path: '',
        data: {
          breadcrumb: 'Settings'
        },
        children: [
          {
            path: 'generic-master',
            loadComponent: () => import('./settings/generic-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/CompanyMaster',
              breadcrumb: 'Company Master'
            }
          },
          {
            path: 'hsn-code-master',
            loadComponent: () => import('./settings/hsn-code-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/DocumentTypeMaster',
              breadcrumb: 'Document Type Master'
            }
          },
          {
            path: 'industry-master',
            loadComponent: () => import('./settings/industry-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PaymentTermMaster',
              breadcrumb: 'Payment Term Master'
            }
          },
          {
            path: 'item-category-master',
            loadComponent: () => import('./settings/item-category-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PortMaster',
              breadcrumb: 'Port Master'
            }
          },
          {
            path: 'item-group-master',
            loadComponent: () => import('./settings/item-group-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PortMaster',
              breadcrumb: 'Port Master'
            }
          },
          {
            path: 'manufacturer-master',
            loadComponent: () => import('./settings/manufacturer-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PortMaster',
              breadcrumb: 'Port Master'
            }
          },
          {
            path: 'product-master',
            loadComponent: () => import('./settings/product-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PortMaster',
              breadcrumb: 'Port Master'
            }
          },
          {
            path: 'uom-master',
            loadComponent: () => import('./settings/uom-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PortMaster',
              breadcrumb: 'Port Master'
            }
          },
        ]
      },

      //Reports
      // {
      //   path: '',
      //   data: {
      //     breadcrumb: 'Reports'
      //   },
      //   children: [
      //     {
      //       path: 'rptEmployeeRegister',
      //       loadComponent: () => import('./reports/rpt-employee-register/index/index.component').then((m) => m.IndexComponent),
      //       canActivate: [AuthenticationGuard, AuthorizationGuard],
      //       data: {
      //         permission: 'CanRead',
      //         menu: 'HR/rptEmployeeRegister',
      //         breadcrumb: 'Employee Register'
      //       }
      //     }
      //   ]
      // }
    ]
  }
];





// [
//   { path: 'ims/item-group-master/index', loadComponent: () => import('./settings/item-group-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/item-category-master/index', loadComponent: () => import('./settings/item-category-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/generic-master/index', loadComponent: () => import('./settings/generic-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/product-master/index', loadComponent: () => import('./settings/product-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/product-master/edit/:id', loadComponent: () => import('./settings/product-master/create/create.component').then((m) => m.CreateComponent) },
//   { path: 'ims/uom-master/index', loadComponent: () => import('./settings/uom-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/manufacturer-master/index', loadComponent: () => import('./settings/manufacturer-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ims/hsn-sac-master/index', loadComponent: () => import('./settings/hsn-code-master/index/index.component').then((m) => m.IndexComponent) },
// ];
