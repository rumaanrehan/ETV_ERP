import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject } from 'rxjs';
import { DataTableDef } from '../../../../../shared/components/z-datatable/z-datatable';
import { ZDataTable } from '../../../../../shared/components/z-datatable/z-datatable.component';
import { Company_IndexTableList } from '../../../settings/company-master/company-master';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';

@Component({
  selector: 'app-gridview',
  standalone: true,
  imports: [ZDataTable],
  templateUrl: './gridview.component.html',
  styleUrl: './gridview.component.scss'
})
export class GridviewComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('salesEnquiryCodeTemplate', { static: true }) salesEnquiryCodeTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: DataTableDef<Company_IndexTableList>;
  tableEvent!: TableLazyLoadEvent;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.tableDef = {
      tableKey: 'IE_SalesEnquiry_IndexTable',
      columnDef: [],
      defaultSortColumn: { sortField: 'SalesEnquiryNo', sortOrder: 1 },
      // filterForm: this.formService.createFormGroup_DataTableFilter<Company_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
      data: [],
      totalRecords: 0,
      loading: false
    };
    this.tableDef.columnDef = [
      { data: 'RowID', label: 'SN', hideVisToggle: true, orderable: false, width: "4%" },
      { data: 'SalesEnquiryNo', label: 'Enquiry No', hideVisToggle: true, filterable: true, width: "10%", customTemplate: this.salesEnquiryCodeTemplate },
      { data: 'CustomerName', label: 'Customer', width: "15%", filterable: true },
      { data: 'EnquiryDate', label: 'Company Type', width: "15%" },
      { data: 'ExpectedDeliveryDate', label: 'EmailID', orderable: false, width: "20%" },
      { data: 'ContactName', label: 'EmailID', orderable: false, width: "20%" },
      { data: 'ContactEmail', label: 'EmailID', orderable: false, width: "20%" },
      { data: 'ContactPhone', label: 'EmailID', orderable: false, width: "20%" },
      { data: 'ExpectedDeliveryDate', label: 'EmailID', orderable: false, width: "20%" },
      { data: 'ImportLicenseNo', label: 'Import License No', orderable: false, width: "20%" },
      { data: 'StatusText', label: 'Status', width: "10%", filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center' },
      { data: '', hideVisToggle: true, orderable: false, width: "6%", customTemplate: this.actionColTemplate },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
