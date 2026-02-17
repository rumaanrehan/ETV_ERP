import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_IndexTableSort } from '../sales-enquiry';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

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
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('salesEnquiryCodeTemplate', { static: true }) salesEnquiryCodeTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<SalesEnquiry_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_SalesEnquiry_IndexDataView',
      columnDef: [],
      defaultSortColumn: { sortField: 'SalesEnquiryNo', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'SalesEnquiryNo', label: 'Enquiry No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false,
      filterFields: [
        { field: 'SalesEnquiryNo', label: 'Enquiry No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown', options: [] } // Options will be loaded by ZDataTable
      ]
    };
    this.tableDef.columnDef = [
      { data: '_selected', label: '', orderable: false, width: "50px", filterable: false, customTemplate: this.selectionColTemplate },
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "70px" },
      { data: 'SalesEnquiryNo', label: 'Enquiry No', hideVisToggle: true, orderable: false, filterable: true, width: "150px", customTemplate: this.salesEnquiryCodeTemplate },
      { data: 'CustomerName', label: 'Customer', orderable: false, filterable: true },
      { data: 'ContactName', label: 'Contact Name', orderable: false },
      { data: 'ContactEmail', label: 'Contact Email', orderable: false },
      { data: 'EnquiryDate', label: 'Enquiry Date', orderable: false, width: "150px" },
      { data: 'ExpectedDeliveryDate', label: 'Exp. Delivery Date', orderable: false, width: "150px" },
      { data: 'StatusText', label: 'Status', orderable: false, width: "150px", filterable: true, cssClass: 'text-center' },
    ];
  }

  onIndexTableLazyLoad(event: DataTableLazyLoadEvent) {
    this.tableEvent = event;
    this.loadData();
  }

  loadData() {
    try {
      this.tableDef.loading = true;
      const model: any = {
        first: this.tableEvent.first,
        last: this.tableEvent.last,
        filters: this.tableDef.filterForm?.value,
        sortings: this.tableDef.sortingForm?.value
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
      this.navContextService.clear();
      this.router.navigate([`ie/sales-enquiry/edit/${enquiryID}`]);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter(), formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
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
