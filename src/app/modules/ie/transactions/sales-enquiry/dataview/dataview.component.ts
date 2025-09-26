import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-data-view/z-data-view';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SalesEnquiry, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList } from '../sales-enquiry';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ZDataViewComponent } from '../../../../../shared/components/z-data-view/z-data-view.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, DataViewModule, ZDataViewComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  // componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<SalesEnquiry_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<SalesEnquiry_IndexTableFilter>

  statusList: StaticList[] = [
    { iValue: 0, Text: "Open", cValue: "" },
    { iValue: 1, Text: "Quoted", cValue: "" },
    { iValue: 2, Text: "Closed", cValue: "" },
  ]

  sortFieldList: any[] = [
    { value: "StatusID", text: "Status" }
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }
  ngOnInit(): void {
      this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
      this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
      this.filterForm = this.formService.createFormGroup<SalesEnquiry_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
      this.dataViewDef = {
        tableKey: 'Admin_SalesEnquiry_IndexDataView',
        defaultSortColumn: { sortField: 'EnquiryNo', sortOrder: 1 },
        filterForm: this.filterForm,
        data: [],
        totalRecords: 0,
        loading: false
      };
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
      this.dataViewEvent = event;
      this.loadData();
    }
  
    onClickPageHeaderAddButton() {
      this.router.navigate(['ie/sales-enquiry/create']);
    }
  
    loadData() {
      try {
        const model: DataViewParams<SalesEnquiry_IndexTableFilter> = {
          first: this.dataViewEvent.first,
          last: this.dataViewEvent.rows,
          sortField: this.dataViewEvent.sortField,
          sortOrder: this.dataViewEvent.sortOrder,
          filters: this.filterForm.value
        };
        this.pageService.PopulateGrid(this.formService.transformFormData(model))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                console.log(response.Data.Items)
                this.dataViewDef.data = response.Data.Items;
                this.dataViewDef.totalRecords = response.Data.TotalRecords;
              }
              else {
                this.dataViewDef.data = [];
                this.dataViewDef.totalRecords = 0;
                this.alertService.showServerResponseToast(response);
              }
            },
            complete: () => {
              this.dataViewDef.loading = false;
            }
          });
      }

  catch (error) {

  }
}

onClickEditDetails(EnquiryID: number) {
  if (EnquiryID) {
    this.router.navigate([`ie/sales-enquiry/edit/${EnquiryID}`]);
  }
}

onClickCancel(row: any) {
  this.alertService
    .showConfirmationWithInput({
      text: 'Do you want to cancel?',
      inputPlaceholder: 'Reason to cancel'
    })
    .then((result) => {
      if (result.isConfirmed) {
        const model: SalesEnquiry = {
          ...row,
          ReasonToUpdate: result.Message
        }

        this.pageService.CancelOrder(model)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.loadData();
              if (response.IsSuccess) {
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
}
populateStatus(statusID: number): string {
    switch (statusID) {
      case 1:
        return 'Processing';
      case 2:
        return 'Ready to ship';
      case 3:
        return 'Canceled';
      default:
        return 'Undefined';
    }
  }
  
  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}

