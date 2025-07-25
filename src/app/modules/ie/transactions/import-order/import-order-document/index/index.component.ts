import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ZDataTable } from '../../../../../../shared/components/z-datatable/z-datatable.component';
import { CreateComponent } from '../create/create.component';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../../shared/components/z-datatable/z-datatable';
import { TableLazyLoadEvent } from 'primeng/table';
import { ImportOrderDocument, ImportOrderDocument_IndexTableFilter, ImportOrderDocument_IndexTableList } from '../import-order-document';
import { PageHeaderService } from '../../../../../../shared/services/page-header.service';
import { ImportOrderDocumentService } from '../import-order-document.service';
import { FormService } from '../../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../../shared/services/alert-notification.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ZDataTable, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('importNoTemplate', { static: true }) importNoTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;

  tableDef!: DataTableDef<ImportOrderDocument_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ImportOrderDocumentService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      tableKey: 'IMS_ImportOrderDocument_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'ImportOrderNo', sortOrder: 1 },
      filterForm: this.formService.createFormGroup_DataTableFilter<ImportOrderDocument_IndexTableFilter>(
        this.pageService.getFormConfig_DataTableFilter()
      ),
      data: [],
      totalRecords: 0,
      loading: false,
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'ImportOrderNo', label: 'Import Order No ', filterable: true },
      { data: 'DocumentTypeCode', label: 'Document Type Code ',  filterable: true, width: "10%"  },
      { data: 'FileName', label: 'File Name ', filterable: true, width: "10%"  },
      { data: 'IsDeleted', label: 'Status', filterable: true, filterType: 'select', filterKey: 'IsDeletedID', customTemplate: this.statusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '3%', customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ImportOrderDocument>());
    }
  }

  onClickEditDetails(importOrderID: number, isCanceled: boolean): void {
    try {
      if (this.createSidebar && importOrderID) {
        this.pageService.GetDetails(importOrderID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.createSidebar.openSidebar(!isCanceled, true, response.Data);
            }
              else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
      }
    } catch (error) {}
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
      const model: DataTableParams<ImportOrderDocument_IndexTableFilter> = {
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
    }
    catch (error) {}
  }

  onClickDeleteReactivate(row: any): void {
    try {
      const actionType = row.IsCanceled ? 'reactivate' : 'delete';
      const inputPlaceholder = row.IsCanceled ? 'Reason to Reactivate' : 'Reason to Delete';

      this.alertService
      .showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${actionType} the ImportOrder "<b>${row.importOrderNo}</b>"?`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const model: ImportOrderDocument = {
            ...row,
            ActionType: actionType,
            ReasonToUpdate: result.value,
          };

          this.pageService.DeleteReactivate(model)
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
    } catch (error) {}
  }
}