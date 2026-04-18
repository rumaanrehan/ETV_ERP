import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, catchError, forkJoin, map, of, takeUntil } from 'rxjs';
import { DataViewDef, DataViewLazyLoadEvent, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { Company_IndexTableFilter, Company_IndexTableList } from '../company-master';
import { CompanyMasterService } from '../company-master.service';

@Component({
  selector: 'app-company-dataview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZDataviewComponent],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class CompanyDataviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;
  @Output() editDetails = new EventEmitter<{ companyID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<Company_IndexTableList>();

  dataViewDef!: DataViewDef<Company_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  constructor(
    private pageService: CompanyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.dataViewDef = {
      tableKey: 'IE_CompanyMaster_IndexTable',
      defaultSortColumn: { sortField: 'CompanyCode', sortOrder: 1 },
      filterForm: this.filterForm,
      sortingForm: this.sortingForm,
      filterFields: [
        { field: 'CompanyCode', label: 'Code', type: 'text' },
        { field: 'CompanyName', label: 'Company Name', type: 'text' },
        { field: 'CompanyTypeID', label: 'Company Type', type: 'dropdown', options: [] },
        { field: 'ActiveStatusID', label: 'Status', type: 'dropdown', options: [] }
      ],
      sortFields: [
        { field: 'CompanyCode', label: 'Code', enabled: true, order: 1 },
        { field: 'CompanyName', label: 'Company Name', enabled: true, order: 0 },
        { field: 'CompanyTypeID', label: 'Company Type', enabled: true, order: 0 },
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

  private loadCardDetails(items: Company_IndexTableList[], totalRecords: number): void {
    if (!items.length) {
      this.dataViewDef.data = [];
      this.dataViewDef.totalRecords = totalRecords;
      this.dataViewDef.loading = false;
      return;
    }

    const detailRequests = items.map((item) =>
      this.pageService.GetDetails(item.CompanyID).pipe(
        map((response) => response?.IsSuccess ? response.Data : null),
        catchError(() => of(null))
      )
    );

    forkJoin(detailRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.dataViewDef.data = items.map((item, index) => {
            const detail = details[index];
            if (!detail) {
              return item;
            }

            return {
              ...item,
              ...detail
            } as Company_IndexTableList;
          });
          this.dataViewDef.totalRecords = totalRecords;
        },
        error: () => {
          this.dataViewDef.data = items;
          this.dataViewDef.totalRecords = totalRecords;
        },
        complete: () => {
          this.dataViewDef.loading = false;
        }
      });
  }

  loadData(): void {
    try {
      this.dataViewDef.loading = true;
      const model: DataViewParams<Company_IndexTableFilter, any> = {
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
              this.loadCardDetails(response.Data.Items ?? [], response.Data.TotalRecords ?? 0);
            } else {
              this.dataViewDef.data = [];
              this.dataViewDef.totalRecords = 0;
              this.dataViewDef.loading = false;
              this.alertService.showServerResponseToast(response);
            }
          },
          error: () => {
            this.dataViewDef.loading = false;
          },
          complete: () => {
            // Loading is ended in `loadCardDetails` after detail API calls complete.
          }
        });
    } catch {
      this.dataViewDef.loading = false;
    }
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      this.formService.resetFormValue<Company_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter() as any, formGroup);
    } else if (formGroup === this.sortingForm) {
      formGroup.reset({ CompanyCode: 1, CompanyName: 0, CompanyTypeID: 0, ActiveStatusID: 0 });
    }
    this.loadData();
  }

  onClickEditDetails(row: Company_IndexTableList): void {
    this.editDetails.emit({ companyID: row.CompanyID, activeStatus: row.ActiveStatus });
  }

  onClickDeleteReactivate(row: Company_IndexTableList): void {
    this.deleteReactivate.emit(row);
  }
}
