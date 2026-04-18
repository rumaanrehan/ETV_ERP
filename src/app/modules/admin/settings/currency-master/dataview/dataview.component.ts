import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { Currency_IndexTableFilter, Currency_IndexTableList } from '../currency-master';
import { CurrencyMasterService } from '../currency-master.service';

@Component({
  selector: 'app-currency-dataview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZDataviewComponent],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class CurrencyDataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ currencyID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<Currency_IndexTableList>();

  dataViewDef!: DataViewDef<Currency_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  constructor(
    private pageService: CurrencyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.dataViewDef = {
      tableKey: 'Admin_CurrencyMaster_IndexTable',
      defaultSortColumn: { sortField: 'CurrencyCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      filterFields: [
        { field: 'CurrencyCode', label: 'Code', type: 'text' },
        { field: 'CountryName', label: 'Country Name', type: 'text' },
        { field: 'CurrencyName', label: 'Currency Name', type: 'text' },
        { field: 'CurrencySymbol', label: 'Currency Symbol', type: 'text' },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'CurrencyCode', label: 'Code', enabled: true, order: 1 },
        { field: 'CountryName', label: 'Country Name', enabled: true, order: 0 },
        { field: 'CurrencyName', label: 'Currency Name', enabled: true, order: 0 },
        { field: 'CurrencySymbol', label: 'Currency Symbol', enabled: true, order: 0 },
        { field: 'ActiveStatusID', label: 'Status', enabled: true, order: 0 }
      ],
      data: [],
      totalRecords: 0,
      loading: false
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent): void {
    this.dataViewEvent = event;
    this.loadData();
  }

  loadData(): void {
    try {
      this.dataViewDef.loading = true;
      const model: DataViewParams<Currency_IndexTableFilter, any> = {
        first: this.dataViewEvent.first,
        last: this.dataViewEvent.rows,
        filters: this.filterForm.value,
        sortings: this.sortingForm.value
      };

      this.pageService.PopulateGrid(this.formService.transformFormData(model) as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.dataViewDef.data = response.Data.Items;
              this.dataViewDef.totalRecords = response.Data.TotalRecords;
            } else {
              this.dataViewDef.data = [];
              this.dataViewDef.totalRecords = 0;
              this.alertService.showServerResponseToast(response);
            }
          },
          complete: () => {
            this.dataViewDef.loading = false;
          }
        });
    } catch {
      this.dataViewDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<Currency_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    } else if (formGroup === this.sortingForm) {
      formGroup.reset({ CurrencyCode: 1, CountryName: 0, CurrencyName: 0, CurrencySymbol: 0, ActiveStatusID: 0 });
    }
    this.loadData();
  }

  onClickEditDetails(row: Currency_IndexTableList): void {
    this.editDetails.emit({ currencyID: row.CurrencyID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: Currency_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
