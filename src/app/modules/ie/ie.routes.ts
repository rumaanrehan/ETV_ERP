
import { Routes } from '@angular/router';
import { AuthorizationGuard } from '../../core/guards/authorization.guard';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';

export const ieRoute: Routes = [
  {
    path: 'ie',
    data: {
      breadcrumb: 'Import/Export',
      breadcrumbPath: '/ie/home'
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
        children: [
          {
            path: 'sales-enquiry',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Sales Enquiry'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/sales-enquiry/index/index.component').then((m) => m.SalesEnquiryIndexComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/SalesEnquiry',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/sales-enquiry/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/SalesEnquiry',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/sales-enquiry/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/SalesEnquiry',
                  breadcrumb: 'Edit'
                }
              }
            ]
          },
          {
            path: 'sales-quotation',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Sales Quotation'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/sales-quotation/index/index.component').then((m) => m.SalesQuotationIndexComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/SalesQuotation',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/sales-quotation/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/SalesQuotation',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/sales-quotation/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/SalesQuotation',
                  breadcrumb: 'Edit'
                }
              },
              // {
              //   path: 'from-enquiry/:salesEnquiryID',
              //   loadComponent: () => import('./transactions/sales-quotation/create/create.component').then((m) => m.CreateComponent),
              //   data: {
              //     permission: 'CanCreate',
              //     menu: 'IE/SalesQuotation',
              //     breadcrumb: 'Create'
              //   }
              // }
            ]
          },
          {
            path: 'purchase-quotation',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Purchase Quotation'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/purchase-quotation/dataview/dataview.component').then((m) => m.DataviewComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/PurchaseQuotation',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/purchase-quotation/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/PurchaseQuotation',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/purchase-quotation/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/PurchaseQuotation',
                  breadcrumb: 'Edit'
                }
              },
              {
                path: 'from-requisition/:purchaseRequisitionID',
                loadComponent: () => import('./transactions/purchase-quotation/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/PurchaseQuotation',
                  breadcrumb: 'Create'
                }
              }
            ]
          },
          {
            path: 'export-order',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Export Order'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/export-order/index/index.component').then((m) => m.ExportOrderIndexComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/ExportOrder'
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/ExportOrder',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/ExportOrder',
                  breadcrumb: 'Edit'
                }
              },
              // {
              //   path: 'from-quotation/:salesQuotationID',
              //   loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent),
              //   data: {
              //     permission: 'CanCreate',
              //     menu: 'IE/ExportOrder',
              //     breadcrumb: 'Create'
              //   }
              // }
            ]
          },
          {
            path: 'proforma-invoice',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Proforma Invoice'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/proforma-invoice/index/index.component').then((m) => m.IndexComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/ProformaInvoice',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/proforma-invoice/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/ProformaInvoice',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/proforma-invoice/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/ProformaInvoice',
                  breadcrumb: 'Edit'
                }
              },
              // {
              //   path: 'from-export/:exportOrderID',
              //   loadComponent: () => import('./transactions/proforma-invoice/create/create.component').then((m) => m.CreateComponent),
              //   data: {
              //     permission: 'CanCreate',
              //     menu: 'IE/ProformaInvoice',
              //     breadcrumb: 'Create'
              //   }
              // }
            ]
          },
          {
            path: 'packing-list',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Packing List'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/packing-list/packing-list.component').then((m) => m.PackingListComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/PackingList',
                }
              },
            ]
          },
          {
            path: 'tax-invoice',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Tax Invoice'
            },
            children: [
              {
                path: '',
                loadComponent: () => import('./transactions/tax-invoice/index/index.component').then((m) => m.IndexComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/TaxInvoice',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/tax-invoice/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/TaxInvoice',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/tax-invoice/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/TaxInvoice',
                  breadcrumb: 'Edit'
                }
              },
              // {
              //   path: 'from-proforma/:proformaInvoiceID',
              //   loadComponent: () => import('./transactions/tax-invoice/create/create.component').then((m) => m.CreateComponent),
              //   data: {
              //     permission: 'CanCreate',
              //     menu: 'IE/TaxInvoice',
              //     breadcrumb: 'Create'
              //   }
              // },
              // {
              //   path: 'from-export/:exportOrderID',
              //   loadComponent: () => import('./transactions/tax-invoice/create/create.component').then((m) => m.CreateComponent),
              //   data: {
              //     permission: 'CanCreate',
              //     menu: 'IE/TaxInvoice',
              //     breadcrumb: 'Create'
              //   }
              // }
            ]
          },
          {
            path: 'import-order',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'Import Order'
            },
            children: [
              {
                path: 'index',
                loadComponent: () => import('./transactions/import-order/dataview/dataview.component').then((m) => m.DataviewComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/ImportOrder'
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/ImportOrder',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/ImportOrder',
                  breadcrumb: 'Edit'
                }
              }
            ]
          },
          {
            path: 'purchase-requisition',
            canActivateChild: [AuthenticationGuard, AuthorizationGuard],
            data: {
              breadcrumb: 'purchase requisition'
            },
            children: [
              {
                path: 'index',
                loadComponent: () => import('./transactions/purchase-requisition/dataview/dataview.component').then((m) => m.DataviewComponent),
                data: {
                  permission: 'CanRead',
                  menu: 'IE/PurchaseRequisition',
                }
              },
              {
                path: 'create',
                loadComponent: () => import('./transactions/purchase-requisition/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/PurchaseRequisition',
                  breadcrumb: 'Create'
                }
              },
              {
                path: 'edit/:id',
                loadComponent: () => import('./transactions/purchase-requisition/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanUpdate',
                  menu: 'IE/PurchaseRequisition',
                  breadcrumb: 'Edit'
                }
              },
              {
                path: 'from-export/:exportOrderID',
                loadComponent: () => import('./transactions/proforma-invoice/create/create.component').then((m) => m.CreateComponent),
                data: {
                  permission: 'CanCreate',
                  menu: 'IE/ProformaInvoice',
                  breadcrumb: 'Create'
                }
              }
            ]
          },
        ]
      },

      //Settings
      {
        path: '',
        data: {
          breadcrumb: 'Settings'
        },
        children: [
          {
            path: 'company-master',
            loadComponent: () => import('./settings/company-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/CompanyMaster',
              breadcrumb: 'Company Master'
            }
          },
          {
            path: 'document-type-master',
            loadComponent: () => import('./settings/document-type-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/DocumentTypeMaster',
              breadcrumb: 'Document Type Master'
            }
          },
          {
            path: 'payment-term-master',
            loadComponent: () => import('./settings/payment-term-master/index/index.component').then((m) => m.IndexComponent),
            canActivate: [AuthenticationGuard, AuthorizationGuard],
            data: {
              permission: 'CanRead',
              menu: 'IE/PaymentTermMaster',
              breadcrumb: 'Payment Term Master'
            }
          },
          {
            path: 'port-master',
            loadComponent: () => import('./settings/port-master/index/index.component').then((m) => m.IndexComponent),
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
//   { path: 'ie/company-master/index', loadComponent: () => import('./settings/company-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/port-master/index', loadComponent: () => import('./settings/port-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/export-order-payment/index', loadComponent: () => import('./transactions/export-order-payment/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/import-order-payment/index', loadComponent: () => import('./transactions/import-order/import-order-payment/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/export-order/dataview', loadComponent: () => import('./transactions/export-order/dataview/dataview.component').then((m) => m.DataviewComponent) },
//   { path: 'ie/export-order/create', loadComponent: () => import('./transactions/export-order/create/create.component').then((m) => m.CreateComponent)},
//   { path: 'ie/export-order/edit/:id', loadComponent: () => import('./transactions/export-order/create/create.component').then(m => m.CreateComponent)},
//   { path: 'ie/import-order/dataview', loadComponent: () => import('./transactions/import-order/dataview/dataview.component').then((m) => m.DataviewComponent) },
//   { path: 'ie/import-order/create', loadComponent: () => import('./transactions/import-order/create/create.component').then((m) => m.CreateComponent)},
//   { path: 'ie/import-order/edit/:id', loadComponent: () => import('./transactions/import-order/create/create.component').then(m => m.CreateComponent)},
//   { path: 'ie/letter-of-credit/index', loadComponent: () => import('./transactions/letter-of-credit/index/index.component').then(m => m.IndexComponent)},
//   { path: 'ie/document-type-master/index', loadComponent: () => import('./settings/document-type-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/document-mapping/index', loadComponent: () => import('./transactions/export-order-document/index/index.component').then((m) => m.IndexComponent) },
//   {path: 'ie/payment-term-master/index', loadComponent: () => import('./settings/payment-term-master/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/export-document-mapping/index', loadComponent: () => import('./transactions/export-order-document/index/index.component').then((m) => m.IndexComponent) },
//   { path: 'ie/import-document-mapping/index', loadComponent: () => import('./transactions/import-order/import-order-document/index/index.component').then((m) => m.IndexComponent) },
// ];
