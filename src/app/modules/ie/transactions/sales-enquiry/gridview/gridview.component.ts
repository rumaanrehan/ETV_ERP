import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { DataTableDef, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList } from '../sales-enquiry';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [CommonModule, ZDataTable, RouterLink, CheckboxModule, FormsModule],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() selectionChange = new EventEmitter<SalesEnquiry_IndexTableList[]>();
  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('salesEnquiryCodeTemplate', { static: true }) salesEnquiryCodeTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<SalesEnquiry_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_SalesEnquiry_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'SalesEnquiryNo', sortOrder: 1 },
      filterForm: this.formService.createFormGroup<SalesEnquiry_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: '_selected', label: '', orderable: false, width: "50px", filterable: false, customTemplate: this.selectionColTemplate },
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "70px" },
      { data: 'SalesEnquiryNo', label: 'Enquiry No', hideVisToggle: true, filterable: true, width: "150px", customTemplate: this.salesEnquiryCodeTemplate },
      { data: 'CustomerName', label: 'Customer', filterable: true },
      { data: 'ContactName', label: 'Contact Name' },
      { data: 'ContactEmail', label: 'Contact Email' },
      { data: 'EnquiryDate', label: 'Enquiry Date', width: "150px" },
      { data: 'ExpectedDeliveryDate', label: 'Exp. Delivery Date', width: "150px" },
      { data: 'StatusText', label: 'Status', width: "150px", filterable: true, cssClass: 'text-center' },
    ];
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try {
      this.tableDef.loading = true;
      const model: any = {
        first: this.tableEvent.first,
        last: this.tableEvent.rows,
        filters: this.tableDef.filterForm?.value,
        sortings: {
          [this.tableEvent.sortField as string]: this.tableEvent.sortOrder as 1 | 0 | -1
        }
      };

      this.pageService.PopulateGrid(this.formService.transformFormData(model))
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
    } catch (error) {
      this.tableDef.loading = false;
    }
  }

  onClickEditDetails(enquiryID: number) {
    if (enquiryID) {
      this.router.navigate([`ie/sales-enquiry/edit/${enquiryID}`]);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  toggleSelectAll(checked: boolean) {
    this.tableDef.data.forEach(x => x._selected = checked);
    this.onSelectionChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
