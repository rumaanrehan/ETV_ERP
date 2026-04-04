import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DataviewComponent } from '../dataview/dataview.component';
import { GridviewComponent } from '../gridview/gridview.component';
import { ProformaInvoiceService } from '../proforma-invoice.service';
import { ProformaInvoice_IndexTableFilter, ProformaInvoice_IndexTableList, ProformaInvoice_IndexTableSort } from '../proforma-invoice';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FormService } from '../../../../../shared/services/form.service';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, DataviewComponent, GridviewComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  @ViewChild(DataviewComponent) dataview?: DataviewComponent;
  @ViewChild(GridviewComponent) gridview?: GridviewComponent;

  @ViewChild('pageHeaderActionTemplate') pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('selectionBar') selectionBar?: ElementRef<HTMLElement>;

  private selectionBarResizeObserver?: ResizeObserver;

  viewType = signal<'card' | 'table'>('card');
  selectedProformaInvoices: ProformaInvoice_IndexTableList[] = [];
  selectAll = false;

  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProformaInvoiceService,
    private formService: FormService,
    private navContextService: NavContextService,
    private router: Router,
    private hostElement: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('proformaInvoiceViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<ProformaInvoice_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
    this.sortingForm = this.formService.createFormGroup<ProformaInvoice_IndexTableSort>(this.pageService.getFormConfig_DataTableSort());

    const savedFilter = localStorage.getItem('proformaInvoiceFilter');
    if (savedFilter) {
      this.filterForm.patchValue(JSON.parse(savedFilter), { emitEvent: false });
    }

    const savedSort = localStorage.getItem('proformaInvoiceSort');
    if (savedSort) {
      this.sortingForm.patchValue(JSON.parse(savedSort), { emitEvent: false });
    }

    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        localStorage.setItem('proformaInvoiceFilter', JSON.stringify(value));
      });

    this.sortingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        localStorage.setItem('proformaInvoiceSort', JSON.stringify(value));
      });
  }

  ngAfterViewInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.scheduleSelectionBarHeightUpdate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageHeaderService.setTemplate(null);
    this.selectionBarResizeObserver?.disconnect();
    this.selectionBarResizeObserver = undefined;
    this.hostElement.nativeElement.style.removeProperty('--proforma-invoice-selection-bar-height');
  }

  toggleView(type: 'card' | 'table'): void {
    this.viewType.set(type);
    localStorage.setItem('proformaInvoiceViewType', type);
    this.selectedProformaInvoices = [];
    this.selectAll = false;
    this.scheduleSelectionBarHeightUpdate();
  }

  onClickPageHeaderAddButton(): void {
    this.navContextService.clear();
    this.router.navigate(['ie/proforma-invoice/create']);
  }

  onSelectionChange(selectedItems: ProformaInvoice_IndexTableList[]): void {
    this.selectedProformaInvoices = selectedItems;
    this.selectAll = selectedItems.length > 0 && selectedItems.every(item => item._selected);
    this.scheduleSelectionBarHeightUpdate();
  }

  toggleSelectAll(event: any): void {
    this.selectAll = !!event?.checked;

    if (this.viewType() === 'card') {
      this.dataview?.toggleSelectAll(this.selectAll);
    } else {
      this.gridview?.toggleSelectAll(this.selectAll);
    }

    this.scheduleSelectionBarHeightUpdate();
  }

  private scheduleSelectionBarHeightUpdate(): void {
    requestAnimationFrame(() => {
      const height = this.selectionBar?.nativeElement?.offsetHeight ?? 0;
      this.hostElement.nativeElement.style.setProperty('--proforma-invoice-selection-bar-height', `${height}px`);

      if (this.selectionBar?.nativeElement) {
        if (!this.selectionBarResizeObserver) {
          this.selectionBarResizeObserver = new ResizeObserver(() => this.scheduleSelectionBarHeightUpdate());
        }
        this.selectionBarResizeObserver.disconnect();
        this.selectionBarResizeObserver.observe(this.selectionBar.nativeElement);
      } else {
        this.selectionBarResizeObserver?.disconnect();
      }
    });
  }
}
