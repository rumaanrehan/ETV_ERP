import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FormService } from '../../../../../shared/services/form.service';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';
import { TaxInvoiceService } from '../tax-invoice.service';
import { TaxInvoice_IndexTableFilter, TaxInvoice_IndexTableList, TaxInvoice_IndexTableSort } from '../tax-invoice';
import { DataviewComponent } from '../dataview/dataview.component';
import { GridviewComponent } from '../gridview/gridview.component';

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
  selectedTaxInvoices: TaxInvoice_IndexTableList[] = [];
  selectAll = false;

  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: TaxInvoiceService,
    private formService: FormService,
    private navContextService: NavContextService,
    private router: Router,
    private hostElement: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('taxInvoiceViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<TaxInvoice_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
    this.sortingForm = this.formService.createFormGroup<TaxInvoice_IndexTableSort>(this.pageService.getFormConfig_DataTableSort());

    const savedFilter = localStorage.getItem('taxInvoiceFilter');
    if (savedFilter) {
      this.filterForm.patchValue(JSON.parse(savedFilter), { emitEvent: false });
    }

    const savedSort = localStorage.getItem('taxInvoiceSort');
    if (savedSort) {
      this.sortingForm.patchValue(JSON.parse(savedSort), { emitEvent: false });
    }

    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        localStorage.setItem('taxInvoiceFilter', JSON.stringify(value));
      });

    this.sortingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        localStorage.setItem('taxInvoiceSort', JSON.stringify(value));
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
    this.hostElement.nativeElement.style.removeProperty('--tax-invoice-selection-bar-height');
  }

  toggleView(type: 'card' | 'table'): void {
    this.viewType.set(type);
    localStorage.setItem('taxInvoiceViewType', type);
    this.selectedTaxInvoices = [];
    this.selectAll = false;
    this.scheduleSelectionBarHeightUpdate();
  }

  onClickPageHeaderAddButton(): void {
    this.navContextService.clear();
    this.router.navigate(['ie/tax-invoice/create']);
  }

  onSelectionChange(selectedItems: TaxInvoice_IndexTableList[]): void {
    this.selectedTaxInvoices = selectedItems;
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
      this.hostElement.nativeElement.style.setProperty('--tax-invoice-selection-bar-height', `${height}px`);

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
