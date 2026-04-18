import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { UOM_IndexTableFilter, UOM_IndexTableList, UOM_IndexTableSort } from '../uom-master';
import { UOMMasterService } from '../uom-master.service';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})
export class DataviewComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();

  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  @Output() editDetails = new EventEmitter<{ uomID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<UOM_IndexTableList>();

  dataViewDef!: DataViewDef<UOM_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  constructor(
    private pageService: UOMMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    if (this.filterForm && this.sortingForm) {
      this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['filterForm'] || changes['sortingForm']) && this.filterForm && this.sortingForm) {
      this.dataViewDef = this.pageService.getDataViewDef(this.filterForm, this.sortingForm);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexDataViewLazyLoad(event: DataViewLazyLoadEvent): void {
    this.dataViewEvent = event;
    this.loadData();
  }

  onResetForm(formGroup: FormGroup): void {
    if (formGroup === this.filterForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableFilter());
    } else if (formGroup === this.sortingForm) {
      formGroup.reset(this.pageService.getFormConfig_DataTableSort());
    }
    this.loadData();
  }

  reload(): void {
    if (this.dataViewEvent) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.dataViewEvent || !this.dataViewDef) return;

    const model: DataViewParams<UOM_IndexTableFilter, UOM_IndexTableSort> = {
      first: this.dataViewEvent.first,
      last: this.dataViewEvent.rows,
      filters: this.filterForm.value,
      sortings: this.sortingForm.value
    };

    this.dataViewDef.loading = true;
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
  }

  onClickEditDetails(uomID: number | null, activeStatus: boolean | null): void {
    if (!uomID) return;
    this.editDetails.emit({ uomID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(item: UOM_IndexTableList): void {
    this.deleteReactivate.emit(item);
  }
}
