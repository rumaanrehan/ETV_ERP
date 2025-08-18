
import { Routes } from '@angular/router';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';
import { AuthorizationGuard } from '../../core/guards/authorization.guard';

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

      //Transactions
      {
        path: '',
        data: {
          breadcrumb: 'Transactions'
        },
        // children: [
        //   {
        //     path: 'export-order',
        //     canActivateChild: [AuthenticationGuard, AuthorizationGuard],
        //     data: {
        //       breadcrumb: 'Export Order'
        //     },
        //     children: [
        //       {
        //         path: 'dataview',
        //         loadComponent: () => import('./transactions/export-order/dataview/dataview.component').then((m) => m.DataviewComponent),
        //         data: {
        //           permission: 'CanRead',
        //           menu: 'IE/ExportOrder'
        //         }
        //       },
        //       {
        //         path: 'create',
        //         loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
        //         data: {
        //           permission: 'CanCreate',
        //           menu: 'IE/ExportOrder',
        //           breadcrumb: 'Create'
        //         }
        //       },
        //       {
        //         path: 'edit/:id',
        //         loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
        //         data: {
        //           permission: 'CanUpdate',
        //           menu: 'IE/ExportOrder',
        //           breadcrumb: 'Edit'
        //         }
        //       }
        //     ]
        //   },
        //   {
        //     path: 'import-order',
        //     canActivateChild: [AuthenticationGuard, AuthorizationGuard],
        //     data: {
        //       breadcrumb: 'Import Order'
        //     },
        //     children: [
        //       {
        //         path: '',
        //         loadComponent: () => import('./transactions/import-order/dataview/dataview.component').then((m) => m.DataviewComponent),
        //         data: {
        //           permission: 'CanRead',
        //           menu: 'IE/ImportOrder'
        //         }
        //       },
        //       {
        //         path: 'create',
        //         loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
        //         data: {
        //           permission: 'CanCreate',
        //           menu: 'IE/ImportOrder',
        //           breadcrumb: 'Create'
        //         }
        //       },
        //       {
        //         path: 'edit/:id',
        //         loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
        //         data: {
        //           permission: 'CanUpdate',
        //           menu: 'IE/ImportOrder',
        //           breadcrumb: 'Edit'
        //         }
        //       }
        //     ]
        //   }
        // ]
      },

      //Settings
      {
        path: '',
        data: {
          breadcrumb: 'Settings'
        },
        children: [
          {
            path: 'module-master',
            loadComponent: () => import('./settings/ModuleMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'Admin/ModuleMaster',
              breadcrumb: 'Module Master'
            }
          },
          {
            path: 'menu-master',
            loadComponent: () => import('./settings/MenuMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/MenuMaster',
              breadcrumb: 'Menu Master'
            }
          },
          {
            path: 'role-master',
            loadComponent: () => import('./settings/RoleMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/RoleMaster',
              breadcrumb: 'Role Master'
            }
          },
          {
            path: 'tax-slab-master',
            loadComponent: () => import('./settings/TaxSlabMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/TaxSlabMaster',
              breadcrumb: 'Tax Slab Master'
            }
          },
          {
            path: 'currency-master',
            loadComponent: () => import('./settings/CurrencyMaster/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/CurrencyMaster',
              breadcrumb: 'Currency Master'
            }
          },
          {
            path: 'designation-master',
            loadComponent: () => import('./settings/designation-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/DesignationMaster',
              breadcrumb: 'Designation Master'
            }
          },
          {
            path: 'employee-type-master',
            loadComponent: () => import('./settings/employee-type-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/EmployeeTypeMaster',
              breadcrumb: 'Employee Type Master'
            }
          },
          // {
          //   path: 'port-master',
          //   loadComponent: () => import('./settings/port-master/index/index.component').then((m) => m.IndexComponent),
          //   canActivate: [AuthenticationGuard, AuthorizationGuard],
          //   data: {
          //     permission: 'CanRead',
          //     menu: 'IE/PortMaster',
          //     breadcrumb: 'Port Master'
          //   }
          // },
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
  // { path: 'admin/state-master/index', loadComponent: () => import('./settings/state-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/currency-master/index', loadComponent: () => import('../admin/settings/CurrencyMaster/index/index.component').then((m) => m.IndexComponent) },

  // { path: 'admin/country-master/index', loadComponent: () => import('./settings/country-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/CityMaster/Index', loadComponent: () => import('./settings/CityMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/designation-master/index', loadComponent: () => import('./settings/designation-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/employee-type-master/index', loadComponent: () => import('./settings/employee-type-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/department-master/index', loadComponent: () => import('./settings/department-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/department-type-master/index', loadComponent: () => import('./settings/department-type-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/BillCompanyMaster/Index', loadComponent: () => import('./settings/BillCompanyMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/HolidayMaster/Index', loadComponent: () => import('./settings/HolidayMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/CountryMaster/Index', loadComponent: () => import('./settings/country-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/RelationshipMaster/Index', loadComponent: () => import('./settings/RelationshipMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/PrefixMaster/Index', loadComponent: () => import('./settings/PrefixMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/role-master/index', loadComponent: () => import('./settings/RoleMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/rack-master/index', loadComponent: () => import('./settings/RackMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/RolePerimssionMaster/Index', loadComponent: () => import('./settings/RolePermission/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/RoomTypeMaster/Index', loadComponent: () => import('./settings/RoomTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/ServiceCategoryMaster/Index', loadComponent: () => import('./settings/ServiceCategoryMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/ServiceGroupMaster/Index', loadComponent: () => import('./settings/ServiceGroupMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/FixServiceMaster/Index', loadComponent: () => import('./settings/FixServiceMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/ModuleMaster/Index', loadComponent: () => import('./settings/ModuleMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/taxslab-master/index', loadComponent: () => import('./settings/TaxSlabMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/RateTypeMaster/Index', loadComponent: () => import('./settings/RateTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/menu-master/index', loadComponent: () => import('./settings/MenuMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/DiscountReasonMaster/Index', loadComponent: () => import('./settings/DiscountReasonMaster/index/index.component').then((m) => m.IndexComponent) },

  // { path: 'Admin/RolePerimssion/Index', loadComponent: () => import('./settings/RolePermission/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/module-master/index', loadComponent: () => import('./settings/ModuleMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/number-format/index', loadComponent: () => import('./settings/NumberFormat/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/PlanMaster/Index', loadComponent: () => import('./settings/PlanMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/PlanMaster/Create', loadComponent: () => import('./settings/PlanMaster/create/create.component').then((m) => m.CreateComponent) },
  // { path: 'Admin/PlanMaster/Edit/:id', loadComponent: () => import('./settings/PlanMaster/create/create.component').then((m) => m.CreateComponent) },

  // { path: 'Admin/ConsultantUnitMaster/Index', loadComponent: () => import('./settings/ConsultantUnitMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/PaymentMode/Index', loadComponent: () => import('./settings/PaymentMode/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'admin/financial-year-master/index', loadComponent: () => import('./settings/financial-year-master/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/WardMaster/Index', loadComponent: () => import('./settings/WardMaster/index/index.component').then((m) => m.IndexComponent) },

  // { path: 'admin/dynamic-amount-master/index', loadComponent: () => import('./settings/DynamicAmountMaster/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/MusheerKhalid/Index', loadComponent: () => import('./settings/Musheer Khalid/index/index.component').then((m) => m.IndexComponent) },

  // { path: 'Admin/EmployeeRegistration/Index', loadComponent: () => import('./transactions/EmployeeRegistration/index/index.component').then((m) => m.IndexComponent) },
  // { path: 'Admin/EmployeeRegistration/Create', loadComponent: () => import('./transactions/EmployeeRegistration/create/create.component').then((m) => m.CreateComponent) },
  // { path: 'Admin/EmployeeRegistration/Index', loadComponent: () => import('./transactions/EmployeeRegistration/index/index.component').then((m) => m.IndexComponent) },//========
  // { path: 'Admin/EmployeeRegistration/Edit/:id', loadComponent: () => import('./transactions/EmployeeRegistration/create/create.component').then((m) => m.CreateComponent) },
  // { path: 'Admin/Kashif/Index', loadComponent: () => import('./settings/Kashif/index/index.component').then((m) => m.IndexComponent) },
];
