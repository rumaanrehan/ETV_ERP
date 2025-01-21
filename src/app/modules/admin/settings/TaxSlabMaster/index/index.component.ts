import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { TaxSlabMaster, TaxSlabMasterList } from '../tax-slab-master';
import { TaxSlabMasterService } from '../tax-slab-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  providers: [FormValidationService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild('taxSlabCodeTemplate', { static: true }) taxSlabCodeTemplate!: TemplateRef<any>;
  @ViewChild('taxSlabPurTax', { static: true }) taxSlabPurTax!: TemplateRef<any>;
  @ViewChild('taxSlabActiveStatusTemplate', { static: true }) taxSlabActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<TaxSlabMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: TaxSlabMasterService,
    private formService: FormService,
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
      { data: 'TaxSlabID', visible: false, orderable: false },
      { data: 'TaxSlabCode', label: 'Code', customTemplate: this.taxSlabCodeTemplate },
      { data: 'TaxType', label: 'Tax Type', customTemplate: this.taxSlabPurTax },
      { data: 'TaxSlabName', label: 'Tax Slab Name' },
      { data: 'TaxRate', label: 'Tax Rate%', orderable: false },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.taxSlabActiveStatusTemplate },
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

  onCloseSidebar(): void {
    this.loadData(this.tableParameters);
  }

  loadData(event: TableLazyLoadEvent) {
    try {
      this.pageService.PopulateGrid(event)
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
    catch (error) {

    }
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<TaxSlabMaster>());
    }
  }

  onClickEditDetails(TaxSlabID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && TaxSlabID) {
        this.pageService.GetDetails(TaxSlabID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: TaxSlabMaster = {
                  ...response.Data
                };
                this.createSidebar.openSidebar(ActiveStatus, true, model);
              }
              else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    }
    catch (error) {

    }
  }

  onClickDelete(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.TaxSlabName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: TaxSlabMaster = {
              ...row,
              ActionType: ActionType,
              ReasonToUpdate: result.value
            };

            this.pageService.DeleteRecord(model)
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
