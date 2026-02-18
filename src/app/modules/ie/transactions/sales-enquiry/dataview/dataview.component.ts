import { Component, ComponentRef, EventEmitter, Input, NgModule, OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule, FormsModule, CheckboxModule, RouterLink],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();
  @Output() selectionChange = new EventEmitter<SalesEnquiry_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  dataViewDef!: DataViewDef<SalesEnquiry_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  selectedSalesEnquiries: SalesEnquiry_IndexTableList[] = [];
  selectAll = false;

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
    if (this.filterForm && this.sortingForm) {
      this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
    }
  }

  ngOnChanges(): void {
    // Re-initialize if inputs change or become available
    if (this.filterForm && this.sortingForm) {
      this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter(), formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<SalesEnquiry_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      this.dataViewDef.loading = true;
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
      this.dataViewDef.loading = false;
      console.error('Error loading sales enquiry data:', error);
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
    this.selectionChange.emit(this.selectedSalesEnquiries);
  }

  toggleSelectAll(checked: boolean) {
    this.selectedSalesEnquiries = [];
    this.dataViewDef.data.forEach((item: SalesEnquiry_IndexTableList) => {
      item._selected = checked;
      if (checked) {
        this.selectedSalesEnquiries.push(item);
      }
    });
    this.selectAll = checked;
    this.selectionChange.emit(this.selectedSalesEnquiries);
  }

  clearSelection() {
    this.dataViewDef.data.forEach(x => x._selected = false);
    this.selectedSalesEnquiries = [];
    this.selectAll = false;
  }
}

