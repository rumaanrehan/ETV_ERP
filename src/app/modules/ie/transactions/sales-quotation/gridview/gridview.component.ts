import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { DataTableDef, DataTableLazyLoadEvent, DataTableParams } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableList, SalesQuotation_IndexTableSort } from '../sales-quotation';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SalesQuotationService } from '../sales-quotation.service';
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
  @Output() selectionChange = new EventEmitter<SalesQuotation_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @ViewChild('selectionColTemplate', { static: true }) selectionColTemplate!: TemplateRef<any>;
  @ViewChild('quotationCodeTemplate', { static: true }) quotationCodeTemplate!: TemplateRef<any>;
  @ViewChild('statusColTemplate', { static: true }) statusColTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<SalesQuotation_IndexTableList>;
  tableEvent!: DataTableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesQuotationService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_SalesQuotation_IndexDataView',
      columnDef: [],
      defaultSortColumn: { sortField: 'SalesQuotationNo', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      sortFields: [
        { field: 'SalesQuotationNo', label: 'Quotation No', enabled: true, order: 1 },
        { field: 'StatusID', label: 'Status', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false,
      rowClick: (row) => this.onClickEditDetails(row.SalesQuotationID),
      filterFields: [
        { field: 'SalesQuotationNo', label: 'Quotation No', type: 'text' },
        { field: 'CustomerName', label: 'Customer', type: 'text' },
        { field: 'StatusID', label: 'Status', type: 'dropdown', options: [] }
      ]
    };
    this.tableDef.columnDef = [
      { data: '_selected', label: '', orderable: false, width: "50px", filterable: false, customTemplate: this.selectionColTemplate },
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "70px" },
      { data: 'SalesQuotationNo', label: 'Quotation No', hideVisToggle: true, orderable: false, filterable: true, width: "150px", customTemplate: this.quotationCodeTemplate },
      { data: 'CustomerName', label: 'Customer', orderable: false, filterable: true },
      { data: 'BasedOn', label: 'Based On', orderable: false, width: "150px" },
      { data: 'NoOfProducts', label: 'No of Products', orderable: false, width: "150px" },
      { data: 'SalesQuotationDate', label: 'Quotation Date', orderable: false, width: "150px" },
      { data: 'ValidityDate', label: 'Valid Till', orderable: false, width: "150px" },
      { data: 'SubtotalAmountFC', label: 'Subtotal', orderable: false, width: "150px" },
      { data: 'TaxAmountFC', label: 'Tax', orderable: false, width: "150px" },
      { data: 'NetAmountFC', label: 'Net Amount', orderable: false, width: "150px" },
      { data: 'StatusText', label: 'Status', orderable: false, width: "130px", filterable: true, customTemplate: this.statusColTemplate },
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

  onClickEditDetails(salesQuotationID: number) {
    if (salesQuotationID) {
      this.navContextService.clear();
      this.router.navigate([`ie/sales-quotation/edit/${salesQuotationID}`]);
    }
  }

  onSelectionChange() {
    this.selectionChange.emit(this.tableDef.data.filter(x => x._selected));
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<SalesQuotation_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter(), formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<SalesQuotation_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
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
