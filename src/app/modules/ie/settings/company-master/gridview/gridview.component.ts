import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { Company_IndexTableFilter, Company_IndexTableList } from '../company-master';
import { CompanyMasterService } from '../company-master.service';

@Component({
  selector: 'app-company-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class CompanyGridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ companyID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<Company_IndexTableList>();

  @ViewChild('companyCodeTemplate', { static: true }) companyCodeTemplate!: TemplateRef<any>;
  @ViewChild('companyTypeTemplate', { static: true }) companyTypeTemplate!: TemplateRef<any>;
  @ViewChild('companyActiveStatusTemplate', { static: true }) companyActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<Company_IndexTableList>;
  tableEvent: any;

  constructor(
    private pageService: CompanyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_CompanyMaster_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'CompanyCode', sortOrder: 1 },
      filterForm: this.filterForm,
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: (row) => this.onClickEditDetails(row)
    };

    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: '4%' },
      { data: 'CompanyCode', label: 'Code', hideVisToggle: true, filterable: true, width: '10%', customTemplate: this.companyCodeTemplate },
      { data: 'CompanyName', label: 'Company Name', width: '20%', filterable: true },
      { data: 'CompanyTypeName', label: 'Company Type', width: '15%', filterable: true, filterType: 'select', filterKey: 'CompanyTypeID', customTemplate: this.companyTypeTemplate },
      { data: 'CompanyEmailID', label: 'EmailID', orderable: false, width: '20%' },
      { data: 'ImportLicenseNo', label: 'Import License No', orderable: false, width: '20%' },
      { data: 'ActiveStatus', label: 'Status', width: '10%', filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.companyActiveStatusTemplate },
      { data: '', hideVisToggle: true, orderable: false, width: '6%', customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: any): void {
    this.tableEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      const model: DataTableParams<Company_IndexTableFilter> = {
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
            } else {
              this.tableDef.data = [];
              this.tableDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.tableDef.loading = false;
          }
        });
    } catch {
      this.tableDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<Company_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    }
  }

  onClickEditDetails(row: Company_IndexTableList): void {
    this.editDetails.emit({ companyID: row.CompanyID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: Company_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
