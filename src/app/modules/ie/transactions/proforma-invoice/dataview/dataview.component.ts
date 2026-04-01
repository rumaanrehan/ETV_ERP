import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { ZDataviewComponent } from '../../../../../shared/components/z-dataview/z-dataview.component';
import { DataViewDef, DataViewParams } from '../../../../../shared/components/z-dataview/z-dataview';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList, ProformaInvoice_IndexTableSort } from '../proforma-invoice';
import { ProformaInvoiceService } from '../proforma-invoice.service';

@Component({
  selector: 'app-dataview',
  standalone: true,
  imports: [CommonModule, ZDataviewComponent, ReactiveFormsModule, ZFormControlsModule, FormsModule, CheckboxModule, RouterLink],
  templateUrl: './dataview.component.html',
  styleUrl: './dataview.component.scss'
})

export class DataviewComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject<void>();
  @Output() selectionChange = new EventEmitter<ProformaInvoice_IndexTableList[]>();
  @Input() filterForm!: FormGroup;
  @Input() sortingForm!: FormGroup;

  dataViewDef!: DataViewDef<ProformaInvoice_IndexTableList>;
  dataViewEvent!: DataViewLazyLoadEvent;

  selectedProformaInvoices: ProformaInvoice_IndexTableList[] = [];
  selectAll = false;

  constructor(
    private pageService: ProformaInvoiceService,
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
      formGroup.reset(this.pageService.getFormConfig_DataTableFilter());
    } else if (formGroup === this.sortingForm) {
      this.formService.resetFormValue<ProformaInvoice_IndexTableSort>(this.pageService.getFormConfig_DataTableSort(), formGroup);
    }
    this.loadData();
  }

  loadData() {
    try {
      this.dataViewDef.loading = true;
      const model: DataViewParams<ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableSort> = {
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
    } catch (error) {
      this.dataViewDef.loading = false;
    }
  }

  onSelectionChange(item: ProformaInvoice_IndexTableList) {
    if (item._selected) {
      if (!this.selectedProformaInvoices.some(x => x.ProformaInvoiceID === item.ProformaInvoiceID)) {
        this.selectedProformaInvoices.push(item);
      }
    } else {
      this.selectedProformaInvoices = this.selectedProformaInvoices.filter(x => x.ProformaInvoiceID !== item.ProformaInvoiceID);
    }
    this.selectAll = this.selectedProformaInvoices.length === this.dataViewDef.data.length;
    this.selectionChange.emit(this.selectedProformaInvoices);
  }

  toggleSelectAll(checked: boolean) {
    this.selectedProformaInvoices = [];
    this.dataViewDef.data.forEach((item: ProformaInvoice_IndexTableList) => {
      item._selected = checked;
      if (checked) {
        this.selectedProformaInvoices.push(item);
      }
    });
    this.selectAll = checked;
    this.selectionChange.emit(this.selectedProformaInvoices);
  }

  clearSelection() {
    this.dataViewDef.data.forEach(x => x._selected = false);
    this.selectedProformaInvoices = [];
    this.selectAll = false;
    this.selectionChange.emit([]);
  }

  onClickEditDetails(id: number): void {
    if (id) {
      this.navContextService.clear();
      this.router.navigate([`ie/proforma-invoice/edit/${id}`]);
    }
  }

  formatCardDate(date: Date): string {
    if (!date) return '-';
    const parsed = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(parsed.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(parsed);
  }

  getStatusBadgeClass(status: string): string {
    const normalized = (status ?? '').toLowerCase().trim();
    if (normalized === 'draft') return 'se-badge--review';
    if (normalized === 'approved') return 'se-badge--received';
    return 'se-badge--default';
  }
}
