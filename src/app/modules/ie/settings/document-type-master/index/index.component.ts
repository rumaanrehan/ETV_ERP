import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { DocumentTypeMaster, DocumentType_IndexFilter, DocumentType_IndexList } from '../document-type-master';
import { DocumentTypeMasterService } from '../document-type-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [FormValidationService],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('documentTypeCodeTemplate', { static: true }) documentTypeCodeTemplate!: TemplateRef<any>;
  @ViewChild('documentTypeActiveStatusTemplate', { static: true }) documentTypeActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('documentIsVerificationRequiredTemplate', { static: true }) documentIsVerificationRequiredTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<DocumentType_IndexList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: DocumentTypeMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      tableKey: 'IE_DocumentType_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'DocumentTypeCode', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<DocumentType_IndexFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false,
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', width: '5%', hideVisToggle: true, orderable: false },
      { data: 'DocumentTypeID', visible: false, hideVisToggle: true, orderable: false },
      { data: 'DocumentTypeCode', label: 'Code', filterable: true, customTemplate: this.documentTypeCodeTemplate },
      { data: 'DocumentTypeName', label: 'Document Type Name', filterable: true },
      { data: 'ShortCode', label: 'Short Code', filterable: true },
      { data: 'IsVerificationRequired', label: 'Approval', filterable: true, filterType: 'select', filterKey: 'IsApprovalRequired', cssClass: 'text-center', customTemplate: this.documentIsVerificationRequiredTemplate },
      { data: 'ActiveStatus', label: 'Status', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', width: '5%', customTemplate: this.documentTypeActiveStatusTemplate,},
      {data: '',hideVisToggle: true, orderable: false,cssClass: 'text-center',width: '5%',customTemplate: this.actionColTemplate,}
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<DocumentTypeMaster>());
    }
  }

  onClickEditDetails(documentTypeID: number, activeStatus: boolean): void {
    if (this.createSidebar && documentTypeID) {
      this.pageService
      .GetDetails(documentTypeID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (response?.IsSuccess && response?.Data) {
            // this.createSidebar.openSidebar(activeStatus, true, response.Data){
               const model: DocumentTypeMaster = {
              DocumentTypeID: response.Data.DocumentTypeID ?? null,
              DocumentTypeCode: response.Data.DocumentTypeCode ?? null,
              DocumentTypeName: response.Data.DocumentTypeName ?? null,
              ShortCode: response.Data.ShortCode ?? null,
              IsVerificationRequired: response.Data.IsVerificationRequired ?? null,
              Description: response.Data.Description ?? null
            };
            this.createSidebar.openSidebar(activeStatus, true, model)
            
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    }
  }

  onCloseSidebar(): void {
    this.loadData();
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<DocumentType_IndexFilter> = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        sortField: this.tableEvent.sortField,
        sortOrder: this.tableEvent.sortOrder,
        filters: this.tableDef.filterForm?.value,
      };

      this.pageService.PopulateGrid(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          } else {
            this.tableDef.data = [];
            this.tableDef.totalRecords = 0;
            this.alertService.showServerResponseToast(response);
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        },
      });
    } catch (error) {
    }
  }

  onClickDeleteReactivate(row: any): void {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.DocumentTypeName}</b>"?`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.DocumentTypeID, result.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.loadData();
                this.alertService.showAlert({
                  type: 'success',
                  text: response.Message,
                  timer: 5000,
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
        }
      });
    } catch (error) {
    }
  }
}