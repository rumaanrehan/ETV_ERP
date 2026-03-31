import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ExportOrderService } from '../export-order.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { FormService } from '../../../../../shared/services/form.service';
import { FormGroup } from '@angular/forms';
import { ExportOrder_IndexTableFilter, ExportOrder_IndexTableSort } from '../export-order';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { DataviewComponent } from '../dataview/dataview.component';
import { GridviewComponent } from '../gridview/gridview.component';
import { ExportOrder_IndexTableList, ExportOrderBulkUpdateRequest } from '../export-order';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
    selector: 'app-export-order-index',
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule, DataviewComponent, GridviewComponent],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss'
})
export class ExportOrderIndexComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$ = new Subject<void>();
    @ViewChild(DataviewComponent) dataview?: DataviewComponent;
    @ViewChild(GridviewComponent) gridview?: GridviewComponent;

    @ViewChild('pageHeaderActionTemplate') pageHeaderActionTemplate!: TemplateRef<any>;
    @ViewChild('selectionBar') selectionBar?: ElementRef<HTMLElement>;

    private selectionBarResizeObserver?: ResizeObserver;

    viewType = signal<'card' | 'table'>('card');
    selectedExportOrders: ExportOrder_IndexTableList[] = [];
    selectAll = false;

    filterForm!: FormGroup;
    sortingForm!: FormGroup;

    constructor(
        private pageHeaderService: PageHeaderService,
        private pageService: ExportOrderService,
        private formService: FormService,
        private alertService: AlertNotificationService,
        private navContextService: NavContextService,
        private router: Router,
        private hostElement: ElementRef<HTMLElement>
    ) { }

    ngOnInit(): void {
        const savedView = localStorage.getItem('exportOrderViewType');

        if (savedView === 'card' || savedView === 'table') {
            this.viewType.set(savedView);
        }

        this.filterForm = this.formService.createFormGroup<ExportOrder_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter());
        this.sortingForm = this.formService.createFormGroup<ExportOrder_IndexTableSort>(this.pageService.getFormConfig_DataTableSort());

        // LOAD SAVED STATE
        const savedFilter = localStorage.getItem('exportOrderFilter');
        if (savedFilter) {
            this.filterForm.patchValue(JSON.parse(savedFilter), { emitEvent: false });
        }

        const savedSort = localStorage.getItem('exportOrderSort');
        if (savedSort) {
            this.sortingForm.patchValue(JSON.parse(savedSort), { emitEvent: false });
        }

        // SAVE STATE ON CHANGE
        this.filterForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                localStorage.setItem('exportOrderFilter', JSON.stringify(value));
            });

        this.sortingForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                localStorage.setItem('exportOrderSort', JSON.stringify(value));
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
        this.hostElement.nativeElement.style.removeProperty('--export-order-selection-bar-height');
    }

    toggleView(type: 'card' | 'table') {
        this.viewType.set(type);
        localStorage.setItem('exportOrderViewType', type);
        this.selectedExportOrders = [];
        this.selectAll = false;
        this.scheduleSelectionBarHeightUpdate();
    }

    onClickPageHeaderAddButton() {
        this.navContextService.clear();
        this.router.navigate(['ie/export-order/create']);
    }

    onSelectionChange(selectedItems: ExportOrder_IndexTableList[]) {
        this.selectedExportOrders = selectedItems;
        this.scheduleSelectionBarHeightUpdate();
    }

    toggleSelectAll(event: any) {
        this.selectAll = event.checked;
        if (this.viewType() === 'card') {
            this.dataview?.toggleSelectAll(event);
        } else {
            this.gridview?.toggleSelectAll(this.selectAll);
        }
        this.scheduleSelectionBarHeightUpdate();
    }

    private scheduleSelectionBarHeightUpdate(): void {
        requestAnimationFrame(() => {
            const height = this.selectionBar?.nativeElement?.offsetHeight ?? 0;
            this.hostElement.nativeElement.style.setProperty('--export-order-selection-bar-height', `${height}px`);

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

    bulkChangeStatus(statusID: number) {
        this.alertService
            .showConfirmationWithInput({
                text: 'Do you want to bulk update <b>Export Order</b>?',
                inputPlaceholder: 'Reason to Bulk Update'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const ids = this.selectedExportOrders.map(x => x.ExportOrderID);
                    const dto: ExportOrderBulkUpdateRequest = {
                        ExportOrderIDs: ids,
                        StatusID: statusID
                    };

                    this.pageService.BulkChangeStatus(dto)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (response) => {
                                if (response.IsSuccess) {
                                    this.alertService.showAlert({
                                        type: 'success',
                                        text: response.Message,
                                        timer: 5000,
                                    });
                                    // Trigger reload in child
                                    this.selectedExportOrders = [];
                                    this.selectAll = false;

                                    if (this.viewType() === 'card') {
                                        this.dataview?.loadData();
                                    } else {
                                        this.gridview?.loadData();
                                    }
                                } else {
                                    this.alertService.showServerResponseAlert(response);
                                }
                            },
                        });
                }
            });
    }
}
