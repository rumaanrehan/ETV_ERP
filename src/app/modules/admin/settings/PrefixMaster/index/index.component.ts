import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { PrefixMaster, PrefixMasterList } from '../prefix-master';
import { PrefixMasterService } from '../prefix-master.service'; 
import { CreateComponent } from '../create/create.component';
import { CommonModule } from '@angular/common';
import { FormService } from '../../../../../shared/services/form.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [IndexTableComponent, CreateComponent, CommonModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('prefixCodeTemplate', { static: true }) prefixCodeTemplate!: TemplateRef<any>;
  @ViewChild('prefixGenderTemplate', { static: true }) prefixGenderTemplate!: TemplateRef<any>;
  @ViewChild('prefixIsAllowedForPatient', { static: true }) prefixIsAllowedForPatient!: TemplateRef<any>;
  @ViewChild('prefixIsAllowedForStaff', { static: true }) prefixIsAllowedForStaff!: TemplateRef<any>;
  @ViewChild('prefixActiveStatusTemplate', { static: true }) prefixActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<PrefixMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: PrefixMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'PrefixID', visible: false, orderable: false },
      { data: 'PrefixCode', label: 'Code', customTemplate: this.prefixCodeTemplate },
      { data: 'PrefixName', label: 'Prefix'},
      { data: 'PrefixGender', label: 'Gender', orderable: false, customTemplate: this.prefixGenderTemplate },
      { data: 'IsAllowedForPatient', label: 'Is AllowedForPatient', orderable: false, cssClass: 'text-center', customTemplate: this.prefixIsAllowedForPatient },
      { data: 'IsAllowedForStaff', label: 'Is AllowedForStaff', orderable: false, cssClass: 'text-center', customTemplate: this.prefixIsAllowedForStaff },
      { data: 'DisplayOrder', label: 'DisplayOrder', cssClass: 'text-center' },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.prefixActiveStatusTemplate },
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
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<PrefixMaster>());
    }
  }

  onClickEditDetails(PrefixID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && PrefixID) {
        this.pageService.GetDetails(PrefixID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: PrefixMaster = {
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
        text: `Do you really want to ${ActionType} the "<b>${row.PrefixName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: PrefixMaster = {
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
