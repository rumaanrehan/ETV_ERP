import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CountryMaster, CountryMasterList } from '../country-master';
import { CountryMasterService } from '../country-master.service';
import { CreateComponent } from '../create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent,CreateComponent],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('countryCodeTemplate', { static: true }) countryCodeTemplate!: TemplateRef<any>;
  @ViewChild('countryIsDefaultTemplate', { static: true }) countryIsDefaultTemplate!: TemplateRef<any>;
  @ViewChild('countryActiveStatusTemplate', { static: true }) countryActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<CountryMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private countryService: CountryMasterService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    // Send the template to the page header
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'CountryID', visible: false, orderable: false },
      { data: 'CountryCode', label: 'Code', customTemplate: this.countryCodeTemplate },
      { data: 'CountryName', label: 'Country Name' },
      { data: 'CountryISOCode', label: 'ISO Code', orderable: false, cssClass: 'text-center' },
      { data: 'IsDefault', label: 'Is Default', orderable: false, cssClass: 'text-center', customTemplate: this.countryIsDefaultTemplate },
      { data: 'ActiveStatus', label: 'Status', orderable: false, cssClass: 'text-center', customTemplate: this.countryActiveStatusTemplate },
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.actionColTemplate }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadData(this.tableParameters);
  }

  loadData(event: TableLazyLoadEvent) {
    this.countryService.PopulateGrid(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          }
          else {
            console.log(response);
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        }
    });
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(false);
    }
  }

  onClickEditDetails(row: CountryMaster) {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, row);
    }
  }

  onCloseSidebar(): void {
    this.loadData(this.tableParameters);
  }

  onClickDelete(row: CountryMasterList) {
    const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
    const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

    console.log(row);
    this.alertService.showConfirmationWithInput({
      inputPlaceholder: inputPlaceholder,
      text: `Do you really want to <b>${ActionType.toUpperCase()} </b> the "<b>${row.CountryName}</b>"?`,
    }).then(result => {
      if (result.isConfirmed) {
        const model: CountryMaster = {
          ...row,
          ActionType: ActionType,
          ReasonToUpdate: result.value
        };
        this.countryService.DeleteRecord(model)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.loadData(this.tableParameters);
                this.alertService.showAlert({
                  type: "success",
                  text: response.Message,
                  timer: 5000
                });
              }
              else {
                this.alertService.showServerResponseAlert({
                  Status: response.Status,
                  Message: response.Message,
                  ValidationErrors: response.ValidationErrors
                });
              }
            }
        });
      }
    });
  }
}
