 import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
 import { TableLazyLoadEvent } from 'primeng/table';
 import { Subject, takeUntil } from 'rxjs';
 import { DataTableDef, DataTableParams } from '../../../../shared/components/z-datatable/z-datatable';
 import { ZDataTable } from '../../../../shared/components/z-datatable/z-datatable.component';
 import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
 import { FormService } from '../../../../shared/services/form.service';
 import { PageHeaderService } from '../../../../shared/services/page-header.service';
 import { CreateComponent } from '../create/create.component';
import { StoreMaster_IndexTableList, StoreMaster_IndexTableFilter, StoreMaster } from '../store-master';
import { StoreMasterService } from '../store-master.service';
 
 @Component({
   selector: 'app-index',
   standalone: true,
   imports: [ZDataTable, CreateComponent],
   templateUrl: './index.component.html',
   styleUrl: './index.component.scss',
 })
 
 export class IndexComponent implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();
   @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
   @ViewChild('storeCodeTemplate', { static: true }) storeCodeTemplate!: TemplateRef<any>;
   @ViewChild('storeMasterActiveStatusTemplate', { static: true }) storeMasterActiveStatusTemplate!: TemplateRef<any>;
   @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
   @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;
 
   tableDef!: DataTableDef<StoreMaster_IndexTableList>;
   tableEvent!: TableLazyLoadEvent;
 
   constructor(
     private pageHeaderService: PageHeaderService,
     private pageService: StoreMasterService,
     private formService: FormService,
     private alertService: AlertNotificationService
   ) { }
 
   ngOnInit(): void {
     this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
 
     this.tableDef = {
       tableKey: 'Admin_StoreMaster_IndexTable',
       columnDef: [],
       defaultSortColumn: { sortField: 'StoreCode', sortOrder: 1 },
       filterForm: this.formService.createFormGroup_DataTableFilter<StoreMaster_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
       data: [],
       totalRecords: 0,
       loading: false
     };
     this.tableDef.columnDef = [
       { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
       { data: 'StoreCode',  label: 'Code', hideVisToggle: true, filterable: true, width: "8%", customTemplate: this.storeCodeTemplate },
       { data: 'StoreName', label: 'Store Name', filterable: true },
       { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: "10%", customTemplate: this.storeMasterActiveStatusTemplate, },
       { data: '', hideVisToggle: true, orderable: false, width: "3%", customTemplate: this.actionColTemplate },
     ];
   }
 
   ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
   }
 
   onClickPageHeaderAddButton(): void {
     if (this.createSidebar) {
       this.createSidebar.openSidebar(true, false, this.formService.createNullObject<StoreMaster>());
     }
   }
 
   onClickEditDetails(StoreID: number, activeStatus: boolean): void {
     try {
       if (this.createSidebar && StoreID) {
         this.pageService.GetDetails(StoreID)
         .pipe(takeUntil(this.destroy$))
         .subscribe({
           next: (response) => {
             if (response.IsSuccess) {
               this.createSidebar.openSidebar(activeStatus, true, response.Data);
             }
             else {
               this.alertService.showServerResponseAlert(response);
             }
           },
         });
       }
     }
     catch (error) {
 
     }
   }
 
   onCloseSidebar(): void {
     this.loadData();
   }
 
   onIndexTableLazyLoad(event: TableLazyLoadEvent): void {
     this.tableEvent = event;
     this.loadData();
   }
 
   loadData(): void {
     try {
       const model: DataTableParams<StoreMaster_IndexTableFilter> = {
         first: this.tableEvent.first,
         last: this.tableEvent.last,
         sortField: this.tableEvent.sortField,
         sortOrder: this.tableEvent.sortOrder,
         filters: this.tableDef.filterForm?.value
       };
       this.pageService.PopulateGrid(model)
       .pipe(takeUntil(this.destroy$))
       .subscribe({
         next: (response) => {
           if (response.IsSuccess) {
             this.tableDef.data = response.Data.Items;
             this.tableDef.totalRecords = response.Data.TotalRecords;
           }
           else {
             this.tableDef.data = [];
             this.tableDef.totalRecords = 0;
             this.alertService.showServerResponseToast(response);
           }
         },
         complete: () => {
           this.tableDef.loading = false;
         }
       });
     }
     catch (error) {
 
     }
   }
 
   onClickDeleteReactivate(row: any): void {
     try {
       const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
       const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
 
       this.alertService.showConfirmationWithInput({
         inputPlaceholder: inputPlaceholder,
         text: `Do you really want to ${ActionType} the "<b>${row.StoreName}</b>"?`,
       })
       .then(result => {
         if (result.isConfirmed) {
           const model: StoreMaster = {
             ...row,
             ActionType: ActionType,
             ReasonToUpdate: result.value
           };
 
           this.pageService.DeleteReactivate(model)
           .pipe(takeUntil(this.destroy$))
           .subscribe({
             next: (response) => {
               if (response.IsSuccess) {
                 this.loadData();
                 this.alertService.showAlert({
                   type: "success",
                   text: response.Message,
                   timer: 5000
                 });
               }
               else {
                 this.alertService.showServerResponseAlert(response);
               }
             }
           });
         }
       });
     }
     catch (error) {
 
     }
   }
 }
 
 