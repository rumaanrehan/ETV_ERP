import { Component, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { SalesEnquiryService } from '../sales-enquiry.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { DataviewComponent } from '../dataview/dataview.component';
import { GridviewComponent } from '../gridview/gridview.component';
import { SalesEnquiry_IndexTableList, SalesEnquiryBulkUpdateRequest } from '../sales-enquiry';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavContextService } from '../../../../../core/services/nav-context.service.service';

@Component({
    selector: 'app-sales-enquiry-index',
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule, DataviewComponent, GridviewComponent],
    templateUrl: './index.component.html',
    styleUrl: './index.component.scss'
})
export class SalesEnquiryIndexComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
    @ViewChild(DataviewComponent) dataview?: DataviewComponent;
    @ViewChild(GridviewComponent) gridview?: GridviewComponent;

    viewType = signal<'card' | 'table'>('card');
    selectedSalesEnquiries: SalesEnquiry_IndexTableList[] = [];
    selectAll = false;

    constructor(
        private pageHeaderService: PageHeaderService,
        private pageService: SalesEnquiryService,
        private alertService: AlertNotificationService,
        private navContextService: NavContextService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
        const savedView = localStorage.getItem('salesEnquiryViewType');
        if (savedView === 'card' || savedView === 'table') {
            this.viewType.set(savedView);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleView(type: 'card' | 'table') {
        this.viewType.set(type);
        localStorage.setItem('salesEnquiryViewType', type);
    }

    onClickPageHeaderAddButton() {
        this.navContextService.clear();
        this.router.navigate(['ie/sales-enquiry/create']);
    }

    onSelectionChange(selectedItems: SalesEnquiry_IndexTableList[]) {
        this.selectedSalesEnquiries = selectedItems;
    }

    toggleSelectAll(event: any) {
        this.selectAll = event.checked;
        if (this.viewType() === 'card') {
            this.dataview?.toggleSelectAll(this.selectAll);
        } else {
            this.gridview?.toggleSelectAll(this.selectAll);
        }
    }

    bulkChangeStatus(statusID: number) {
        this.alertService
            .showConfirmationWithInput({
                text: 'Do you want to bulk update <b>Sales Enquiry</b>?',
                inputPlaceholder: 'Reason to Bulk Update'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const ids = this.selectedSalesEnquiries.map(x => x.SalesEnquiryID);
                    const dto: SalesEnquiryBulkUpdateRequest = {
                        SalesEnquiryIDs: ids,
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
                                    this.selectedSalesEnquiries = [];
                                    this.selectAll = false;
                                } else {
                                    this.alertService.showServerResponseAlert(response);
                                }
                            },
                        });
                }
            });
    }
}
