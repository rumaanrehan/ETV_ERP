import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { Subject, takeUntil } from 'rxjs';
import { DataViewDef, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { RoleMaster_IndexTableFilter, RoleMaster_IndexTableList, RoleMaster_IndexTableSort } from '../role-master';
import { RoleMasterService } from '../role-master.service';

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

  @Output() editDetails = new EventEmitter<{ roleID: number; activeStatus: boolean }>();
  @Output() deleteReactivate = new EventEmitter<RoleMaster_IndexTableList>();

  dataViewDef!: DataViewDef<RoleMaster_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  constructor(
    private pageService: RoleMasterService,
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

    const model: DataViewParams<RoleMaster_IndexTableFilter, RoleMaster_IndexTableSort> = {
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

  onClickEditDetails(roleID: number | null, activeStatus: boolean | null): void {
    if (!roleID) return;
    this.editDetails.emit({ roleID, activeStatus: !!activeStatus });
  }

  onClickDeleteReactivate(item: RoleMaster_IndexTableList): void {
    this.deleteReactivate.emit(item);
  }
}
