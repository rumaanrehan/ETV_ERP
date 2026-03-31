import { CommonModule } from '@angular/common';
import { Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SalesQuotation, SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableList, SalesQuotation_IndexTableSort } from '../sales-quotation';
import { SalesQuotationService } from '../sales-quotation.service';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
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
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @Output() selectionChange = new EventEmitter<SalesQuotation_IndexTableList[]>();
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  componentRef?: ComponentRef<any>;

  dataViewDef!: DataViewDef<SalesQuotation_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  selectedSalesQuotations: SalesQuotation_IndexTableList[] = [];
  selectAll = false;


  statusList: StaticList[] = []
  basedOnList: StaticList[] = []

  sortFieldList: any[] = [
    { value: "SalesQuotationDate", text: "Quotation Date" },
    { value: "StatusID", text: "Status" },
  ]

  constructor(
    private pageService: SalesQuotationService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private navContextService: NavContextService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'BasedOn', targetList: 'basedOnList' }

    ]);
    // this.pageService.GetMasterDropdownLists()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (data) => {
    //       this.paymentTermList = data.paymentTermList.Data.Items;
    //       this.taxSlabList = data.taxSlabList.Data.Items;
    //       this.currencyList = data.currencyList.Data.Items;
    //     },
    //   });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof DataviewComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'SalesQuotation',
        FieldName: fieldName,
      });
    });

    forkJoin(sources)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          listConfigs.forEach(({ targetList }) => {
            if (response[targetList]?.IsSuccess) {
              (this[targetList] as StaticList[]) = response[targetList].Data.Items || [];
            } else {
              (this[targetList] as StaticList[]) = [];
            }
          });
        },
      });
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent) {
    this.dataViewEvent = event;
    this.loadData();
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      const filterConfig = this.pageService.getFormConfig_DataTableFilter();
      this.formService.resetFormValue<SalesQuotation_IndexTableFilter>(filterConfig, formGroup);
    } else if (formGroup === this.sortingForm) {
      const sortingConfig = this.pageService.getFormConfig_DataTableSort();
      this.formService.resetFormValue<SalesQuotation_IndexTableSort>(sortingConfig, formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      const model: DataViewParams<SalesQuotation_IndexTableFilter, SalesQuotation_IndexTableSort> = {
        first: this.dataViewEvent?.first ?? 1,
        last: this.dataViewEvent?.rows ?? 25,
        filters: this.filterForm.value,
        sortings: this.sortingForm.value
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

  onClickEditDetails(salesQuotationID: number) {
    if (salesQuotationID) {
      this.router.navigate([`ie/sales-quotation/edit/${salesQuotationID}`]);
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
          const model: SalesQuotation = {
            ...row,
            ReasonToUpdate: result.Message
          }

          this.pageService.CancelQuotation(model)
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



  onSelectionChange(item: SalesQuotation_IndexTableList) {
    if (item._selected) {
      this.selectedSalesQuotations.push(item);
    } else {
      this.selectedSalesQuotations =
        this.selectedSalesQuotations.filter(
          x => x.SalesQuotationID !== item.SalesQuotationID
        );
    }
    this.selectAll = this.selectedSalesQuotations.length === this.dataViewDef.data.length;
    // Emit selected items to parent index component
    this.selectionChange.emit(this.selectedSalesQuotations);
  }

  toggleSelectAll(event: any) {
    this.selectedSalesQuotations = [];
    this.dataViewDef.data.forEach((item: SalesQuotation_IndexTableList) => {
      item._selected = event.checked;
      if (event.checked) {
        this.selectedSalesQuotations.push(item);
      }
    });
    // Emit selected items to parent index component
    this.selectionChange.emit(this.selectedSalesQuotations);
  }

  clearSelection() {
    this.dataViewDef.data.forEach(x => x._selected = false);
    this.selectedSalesQuotations = [];
    this.selectAll = false;
    this.selectionChange.emit([]);
  }

  formatDate(date: Date) {
    return DateUtils.formatDate(date);
  }
}
