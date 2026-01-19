import { Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PurchaseRequisition, PurchaseRequisition_IndexTableFilter, PurchaseRequisition_IndexTableList, PurchaseRequisition_IndexTableSort } from '../purchase-requisition';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { PurchaseRequisitionService } from '../purchase-requisition.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { Router } from '@angular/router';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { CommonModule } from '@angular/common';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class DataviewComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  
  componentRef?: ComponentRef<any>;
  
  dataViewDef!: DataViewDef<PurchaseRequisition_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;
  
  filterForm!: FormGroup;
  filterFormConfig!: FormConfigType<PurchaseRequisition_IndexTableFilter>
  sortingForm!: FormGroup;
  sortingFormConfig!: FormConfigType<PurchaseRequisition_IndexTableSort>

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: PurchaseRequisitionService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterFormConfig = this.pageService.getFormConfig_DataTableFilter();
    this.filterForm = this.formService.createFormGroup<PurchaseRequisition_IndexTableFilter>(this.filterFormConfig);
    this.sortingFormConfig = this.pageService.getFormConfig_DataTableSort();
    this.sortingForm = this.formService.createFormGroup<PurchaseRequisition_IndexTableSort>(this.sortingFormConfig);
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
    this.router.navigate(['ie/purchase-requisition/create']);
  }
  
  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<PurchaseRequisition_IndexTableFilter>(this.filterFormConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<PurchaseRequisition_IndexTableSort>(this.sortingFormConfig, formGroup);
    }
    this.loadData();
  }
  
  loadData() {
    try {
      const model: DataViewParams<PurchaseRequisition_IndexTableFilter, PurchaseRequisition_IndexTableSort> = {
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

  onClickEditDetails(purchaseRequisitionID: number) {
    if (purchaseRequisitionID) {
      this.router.navigate([`ie/purchase-requisition/edit/${purchaseRequisitionID}`]);
    }
  }
  
  onClickCancel(purchaseRequisitionID: number) {
    this.alertService
      .showConfirmationWithInput({
        text: 'Do you want to cancel?',
        inputPlaceholder: 'Reason to cancel'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.pageService.CancelOrder(purchaseRequisitionID, result.value)
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
}
