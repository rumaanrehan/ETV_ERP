import { DeleteUOM_Master, UOMMaster } from './../UOM-master';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { CreateComponent } from '../create/create.component';
import { Subject, takeUntil } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { UOMMasterService } from '../UOM-master.service';
import { CreateComponent } from '../create/create.component';
import { IndexTableComponent, IndexTableParams } from '../../../../shared/components/index-table/index-table.component';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { PageHeaderService } from '../../../../shared/services/page-header.service';
import { FormService } from '../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CommonModule, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService, DatePipe],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true })
  pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('UOMTemplate', { static: true })
  UOMTemplate!: TemplateRef<any>;

  @ViewChild('UOMCodeTemplate', { static: true })
  UOMCodeTemplate!: TemplateRef<any>;

  @ViewChild('UOMNameTemplate', { static: true })
  UOMNameTemplate!: TemplateRef<any>;

  @ViewChild('IsActiveTemplate', { static: true })
  IsActiveTemplate!: TemplateRef<any>;

  @ViewChild('CreatedByDateInTemplate', { static: true })
  CreatedDateTime!: TemplateRef<any>;

  @ViewChild('ModifyByDateInTemplate', { static: true })
  ModifiedDateTime!: TemplateRef<any>;

  @ViewChild('actionColTemplate', { static: true })
  actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<any>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    // private router: Router,
    private pageService: UOMMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.tableDef = {
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false,
      columnDef: [
        {
          data: 'UOMID',
          visible: false,
          orderable: false,
          customTemplate: this.UOMTemplate,
        },
        {
          data: 'UOMCode',
          label: 'Code',
          customTemplate: this.UOMCodeTemplate,
        },
        {
          data: 'UOMName',
          label: 'Name',
          // orderable: false,
          customTemplate: this.UOMNameTemplate,
        },
        {
          data: 'CreatedDateTime',
          label: 'CreatedDateTime ',
          orderable: false,
          cssClass: 'text-center',
          customTemplate: this.CreatedDateTime,
        },
        {
          data: 'ModifiedDateTime',
          label: 'ModifiedDateTime',
          orderable: false,
          cssClass: 'text-center',
          customTemplate: this.ModifiedDateTime,
        },
        {
          data: 'ActiveStatus',
          label: 'Status',
          customTemplate: this.IsActiveTemplate,
        },
        {
          data: '',
          orderable: false,
          cssClass: 'text-center',
          customTemplate: this.actionColTemplate,
        },
      ],
    };
    // this.loaditem(this.tableParameters);
  }

  loadItem(tableParameters: TableLazyLoadEvent) {
    // this.tableDef.loading = true;
    console.log(tableParameters);
    this.pageService
      .PopulateGrid(tableParameters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.Data.Items);
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
            this.tableDef.totalRecords = response.Data.TotalRecords;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.tableDef.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadItem(this.tableParameters);
  }

  onCloseSidebar(): void {
    this.loadItem(this.tableParameters);
  }

  onClickDelete(item: DeleteUOM_Master) {
    console.log('I want to delete this: ' + item.UOMID);
    try {
      const ActionType = 'Delete';
      const inputPlaceholder = 'Reason to Delete';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${
            item.UOMName
          }</b>"?`,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            const model: DeleteUOM_Master = {
              ...item,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.pageService
              .DeleteItem(Number(item.UOMID))
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  this.loadItem(this.tableParameters);
                  if (response.IsSuccess) {
                    // this.loaditem();//============
                    this.alertService.showAlert({
                      type: 'success',
                      text: response.Message,
                      timer: 5000,
                    });
                  } else {
                    this.alertService.showServerResponseAlert(response);
                  }
                },
                error: (err) => {
                  console.error('Error deleting item group:', err);
                  this.alertService.showAlert({
                    type: 'error',
                    text: 'Failed to delete item group. Please try again later.',
                    timer: 5000,
                  });
                },
              });
          }
        });
    } catch (error) {
      console.error('Error in onClickDelete:', error);
    }
  }

  onClickPageHeaderAddButton() {
    console.log('header btn clicked..');
    console.log(this.createSidebar);
    if (this.createSidebar) {
      this.createSidebar.openSidebar(
        true,
        false,
        this.formService.createNullObject<UOMMaster>()
      );
    }
  }

  onClickEditDetails(itemCode: string, ActiveStatus: boolean) {
    console.log(itemCode, '......edit is clickd');
    this.createSidebar.Id = Number(itemCode);
    try {
      if (this.createSidebar && itemCode) {
        this.pageService
          .GetDetails(itemCode)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: UOMMaster = {
                  ...response.Data,
                };
                this.createSidebar.openSidebar(ActiveStatus, true, model);
                console.log('sidebar opened');
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) {}
  }

}
