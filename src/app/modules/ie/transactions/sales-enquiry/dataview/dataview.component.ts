import { Component, ComponentRef, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SalesEnquiry, SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableList, SalesEnquiry_IndexTableSort, SalesEnquiryBulkUpdateRequest } from '../sales-enquiry';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { CommonModule } from '@angular/common';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { DataViewDef, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule, FormsModule, CheckboxModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<SalesEnquiry_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<SalesEnquiry_IndexTableFilter>
  sortingForm!: FormGroup;
  sortingFormConfig!: FormConfigType<SalesEnquiry_IndexTableSort>

  selectedSalesEnquiries: SalesEnquiry_IndexTableList[] = [];
  selectAll = false;

  statusList: StaticList[] = []

  sortFieldList: any[] = [
    { value: "SalesEnquiryNo", text: "Sales Enquiry No" },
    { value: "EnquiryDate", text: "Enquiry Date" },
    { value: "ExpectedDeliveryDate", text: "Expected Delivery Date" }
  ]

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: SalesEnquiryService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<SalesEnquiry_IndexTableFilter>(this.filterFormConfig);
    this.sortingFormConfig = this.pageService.getFormConfig_DataTableSort();
    this.sortingForm = this.formService.createFormGroup<SalesEnquiry_IndexTableSort>(this.sortingFormConfig);
    this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
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
    this.navContextService.clear();
    this.router.navigate(['ie/sales-enquiry/create']);
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableFilter>(this.filterFormConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableSort>(this.sortingFormConfig, formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      const model: DataViewParams<SalesEnquiry_IndexTableFilter, SalesEnquiry_IndexTableSort> = {
        first: this.dataViewEvent.first,
        last: this.dataViewEvent.rows,
        filters: this.filterForm.value,
        sortings: this.sortingForm.value,
      };
      this.pageService.PopulateGrid(this.formService.transformFormData(model))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
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

  onClickEditDetails(enquiryID: number) {
    if (enquiryID) {
      this.router.navigate([`ie/sales-enquiry/edit/${enquiryID}`]);
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

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }

  onSelectionChange(item: SalesEnquiry_IndexTableList) {

    if (item._selected) {
      this.selectedSalesEnquiries.push(item);
    } else {
      this.selectedSalesEnquiries =
        this.selectedSalesEnquiries.filter(
          x => x.SalesEnquiryID !== item.SalesEnquiryID
        );
    }

    this.selectAll = this.selectedSalesEnquiries.length === this.dataViewDef.data.length;
  }

  toggleSelectAll(event: any) {
    this.selectedSalesEnquiries = [];

    this.dataViewDef.data.forEach((item: SalesEnquiry_IndexTableList) => {
      item._selected = event.checked;
      if (event.checked) {
        this.selectedSalesEnquiries.push(item);
      }
    });
  }

  bulkChangeStatus(statusID: number) {
    this.alertService
      .showConfirmationWithInput({
        text: 'Do you want to bulk update <b>Sales Enquiry</b>?',
        inputPlaceholder: 'Reason to Bulk Update'
      })
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedSalesEnquiries.map(x => x.SalesEnquiryID);
          const dto: SalesEnquiryBulkUpdateRequest = {
            SalesEnquiryIDs: ids,
            StatusID: statusID
          };

          this.pageService.BulkChangeStatus(dto)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.loadData();
                this.clearSelection();
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

  clearSelection() {
    this.dataViewDef.data.forEach(x => x._selected = false);
    this.selectedSalesEnquiries = [];
    this.selectAll = false;
  }
}

