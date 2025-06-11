
import { Routes } from '@angular/router';

export const adminRoute: Routes = [
  { path: 'item-group/index', loadComponent: () => import('../../components/Item-Group/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/state-master/index', loadComponent: () => import('./settings/StateMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/country-master/index', loadComponent: () => import('./settings/country-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/CityMaster/Index', loadComponent: () => import('./settings/CityMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/DesignationMaster/Index', loadComponent: () => import('./settings/DesignationMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/EmployeeTypeMaster/Index', loadComponent: () => import('./settings/EmployeeTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/department-master/index', loadComponent: () => import('./settings/DepartmentMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/DepartmentTypeMaster/Index', loadComponent: () => import('./settings/DepartmentTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/BillCompanyMaster/Index', loadComponent: () => import('./settings/BillCompanyMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/HolidayMaster/Index', loadComponent: () => import('./settings/HolidayMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/CountryMaster/Index', loadComponent: () => import('./settings/country-master/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/RelationshipMaster/Index', loadComponent: () => import('./settings/RelationshipMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/PrefixMaster/Index', loadComponent: () => import('./settings/PrefixMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/role-master/index', loadComponent: () => import('./settings/RoleMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/rack-master/index', loadComponent: () => import('./settings/RackMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/RolePerimssionMaster/Index', loadComponent: () => import('./settings/RolePermission/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/RoomTypeMaster/Index', loadComponent: () => import('./settings/RoomTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/ServiceCategoryMaster/Index', loadComponent: () => import('./settings/ServiceCategoryMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/ServiceGroupMaster/Index', loadComponent: () => import('./settings/ServiceGroupMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/FixServiceMaster/Index', loadComponent: () => import('./settings/FixServiceMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/ModuleMaster/Index', loadComponent: () => import('./settings/ModuleMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/taxslab-master/index', loadComponent: () => import('./settings/TaxSlabMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/RateTypeMaster/Index', loadComponent: () => import('./settings/RateTypeMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/menu-master/index', loadComponent: () => import('./settings/MenuMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/DiscountReasonMaster/Index', loadComponent: () => import('./settings/DiscountReasonMaster/index/index.component').then((m) => m.IndexComponent) },

  { path: 'Admin/RolePerimssion/Index', loadComponent: () => import('./settings/RolePermission/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/module-master/index', loadComponent: () => import('./settings/ModuleMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'admin/number-format/index', loadComponent: () => import('./settings/NumberFormat/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/PlanMaster/Index', loadComponent: () => import('./settings/PlanMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/PlanMaster/Create', loadComponent: () => import('./settings/PlanMaster/create/create.component').then((m) => m.CreateComponent) },
  { path: 'Admin/PlanMaster/Edit/:id', loadComponent: () => import('./settings/PlanMaster/create/create.component').then((m) => m.CreateComponent) },

  { path: 'Admin/ConsultantUnitMaster/Index', loadComponent: () => import('./settings/ConsultantUnitMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/PaymentMode/Index', loadComponent: () => import('./settings/PaymentMode/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/FinYearMaster/Index', loadComponent: () => import('./settings/FinYearMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/WardMaster/Index', loadComponent: () => import('./settings/WardMaster/index/index.component').then((m) => m.IndexComponent) },

  { path: 'admin/dynamic-amount-master/index', loadComponent: () => import('./settings/DynamicAmountMaster/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/MusheerKhalid/Index', loadComponent: () => import('./settings/Musheer Khalid/index/index.component').then((m) => m.IndexComponent) },

  { path: 'Admin/EmployeeRegistration/Index', loadComponent: () => import('./Transactions/EmployeeRegistration/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/EmployeeRegistration/Create', loadComponent: () => import('./Transactions/EmployeeRegistration/create/create.component').then((m) => m.CreateComponent) },
  // { path: 'Admin/ProductMaster/Create', loadComponent: () => import('./../../components/product-master/create/create.component').then((m) => m.Create_ProductMasterComponent) },//========
  { path: 'Admin/EmployeeRegistration/Edit/:id', loadComponent: () => import('./Transactions/EmployeeRegistration/create/create.component').then((m) => m.CreateComponent) },
  { path: 'Admin/ReferredByRegistration/Index', loadComponent: () => import('./Transactions/ReferredByRegistration/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/ConsultantUnitMapping/Index', loadComponent: () => import('./Transactions/ConsultantUnitMapping/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/Kashif/Index', loadComponent: () => import('./settings/Kashif/index/index.component').then((m) => m.IndexComponent) },
  { path: 'Admin/ConsultantUnitMapping/Index', loadComponent: () => import('./Transactions/ConsultantUnitMapping/index/index.component').then((m) => m.IndexComponent) },
];
