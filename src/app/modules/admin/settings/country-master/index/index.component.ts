import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AlertNotificationService } from "../../../../../shared/services/alert-notification.service";
import { FormValidationService } from "../../../../../shared/services/form-validation.service";
import { PageHeaderService } from "../../../../../shared/services/page-header.service";
import { Country_IndexTableFilter, Country_IndexTableList, CountryMaster } from "../country-master";
import { CountryMasterService } from "../country-master.service";
import { DataTableDef, DataTableParams } from "../../../../../shared/components/z-datatable/z-datatable";
import { TableLazyLoadEvent } from "primeng/table";
import { ZDataTable } from "../../../../../shared/components/z-datatable/z-datatable.component";
import { FormService } from "../../../../../shared/services/form.service";

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [ZDataTable],
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
    @ViewChild('countryActiveStatusTemplate', { static: true }) countryActiveStatusTemplate!: TemplateRef<any>;
    @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

    tableDef!: DataTableDef<Country_IndexTableList>;
    tableEvent!: TableLazyLoadEvent;

    constructor(
        private pageService: CountryMasterService,
        private pageHeaderService: PageHeaderService,
        private formService: FormService,
        private alertService: AlertNotificationService,
    ) { }

    ngOnInit(): void {
        this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
        this.tableDef = {
            columnDef: [],
            tableKey: 'Admin_CountryMaster_IndexTable',
            defaultSortColumn: { sortField: '', sortOrder: 1 },
            filterForm: this.formService.createFormGroup_DataTableFilter<Country_IndexTableFilter>(this.pageService.getFormConfig_DataTableFilter()),
            data: [],
            totalRecords: 0,
            loading: false
        };

        this.tableDef.columnDef = [
            { data: 'CountryID', visible: false, orderable: false },
            { data: 'CountryCode', label: 'Code', hideVisToggle: true, filterable: true, width: "10%" },
            { data: 'CountryName', filterable: true, label: 'Country Name' },
            { data: 'CountryISOCode', filterable: true, label: 'ISO Code', orderable: false },
            { data: 'ActiveStatus', label: 'Status', width: "10%", filterable: true, filterType: 'select', filterKey: 'ActiveStatusID', cssClass: 'text-center', customTemplate: this.countryActiveStatusTemplate },
            { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
        ];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // onClickPageHeaderAddButton(): void {
    //     if (this.createSidebar) {
    //         this.createSidebar.openSidebar(true, false, this.formService.createNullObject<CountryMaster>());
    //     }
    // }

    onIndexTableLazyLoad(event: TableLazyLoadEvent) {
        this.tableEvent = event;
        this.loadData();
    }

    loadData(): void {
        const model: DataTableParams<Country_IndexTableFilter> = {
            first: this.tableEvent.first,
            last: this.tableEvent.last,
            sortField: this.tableEvent.sortField,
            sortOrder: this.tableEvent.sortOrder,
            filters: this.tableDef.filterForm?.value
        };

        this.pageService.PopulateGrid(model)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    if (response.IsSuccess) {
                        this.tableDef.data = response.Data.Items;
                        this.tableDef.totalRecords = response.Data.TotalRecords;
                    }
                    else {
                        this.alertService.showServerResponseAlert(response);
                    }
                },
                complete: () => {
                    this.tableDef.loading = false;
                }
            });
    }

    onClickDeleteReactivate(row: any): void {
        try {
            const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
            const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

            this.alertService.showConfirmationWithInput({
                inputPlaceholder: inputPlaceholder,
                text: `Do you really want to ${ActionType} the "<b>${row.CountryName}</b>"?`,
            })
                .then(result => {
                    if (result.isConfirmed) {
                        const model: CountryMaster = {
                            ...row,
                            ActionType: ActionType,
                            ReasonToUpdate: result.value
                        };

                        this.pageService.DeleteReactivate(model)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe({
                                next: (response) => {
                                    if (response.IsSuccess) {
                                        this.loadData();
                                        this.alertService.showAlert({
                                            type: "success",
                                            text: response.Message,
                                            timer: 5000
                                        });
                                    }
                                    else {
                                        this.alertService.showServerResponseAlert(response);
                                    }
                                }
                            });
                    }
                });
        }
        catch (error) {

        }
    }
}
