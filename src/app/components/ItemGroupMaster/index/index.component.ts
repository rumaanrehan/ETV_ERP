import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  IndexTableComponent,
  IndexTableParams,
} from '../../../shared/components/index-table/index-table.component';
import { Subject, takeUntil } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { PageHeaderService } from '../../../shared/services/page-header.service';
import { FormService } from '../../../shared/services/form.service';
import { ItemGroupMasterService } from '../ItemGroupMaster.service';
import { ItemGroupMaster } from '../ItemGroupMaster';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { CreateComponent } from '../create/create.component';

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

  @ViewChild('ItemGroupIDTemplate', { static: true })
  ItemGroupIDTemplate!: TemplateRef<any>;

  @ViewChild('ItemGroupCodeTemplate', { static: true })
  ItemGroupCodeTemplate!: TemplateRef<any>;

  @ViewChild('ItemGroupNameTemplate', { static: true })
  ItemGroupNameTemplate!: TemplateRef<any>;

  @ViewChild('CreatedByDateInTemplate', { static: true })
  CreatedDateTime!: TemplateRef<any>;

  @ViewChild('ModifyByDateInTemplate', { static: true })
  ModifiedDateTime!: TemplateRef<any>;

  @ViewChild('actionColTemplate', { static: true })
  actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<any>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: ItemGroupMasterService,
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
          data: 'ItemGroupID',
          visible: false,
          orderable: false,
          customTemplate: this.ItemGroupIDTemplate,
        },
        {
          data: 'ItemGroupCode',
          label: 'Code',
          customTemplate: this.ItemGroupCodeTemplate,
        },
        {
          data: 'ItemGroupName',
          label: 'Name',
          // orderable: false,
          customTemplate: this.ItemGroupNameTemplate,
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
          data: '',
          orderable: false,
          cssClass: 'text-center',
          customTemplate: this.actionColTemplate,
        },
      ],
    };
    // this.loaditmeGroup(this.tableParameters);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItem(tableParameters: TableLazyLoadEvent) {
    // this.tableDef.loading = true;
    console.log(tableParameters);
    this.pageService
      .PopulateGrid(tableParameters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
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

  onIndexTableLazyLoad(event: TableLazyLoadEvent) {
    this.tableParameters = event;
    this.loadItem(this.tableParameters);
  }

  onCloseSidebar(): void {
    this.loadItem(this.tableParameters);
  }

  onClickDelete(itmeGroup: any) {
    console.log('I want to delete this: ' + itmeGroup.ItemGroupID);
    try {
      const ActionType = 'Delete';
      const inputPlaceholder = 'Reason to Delete';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${
            itmeGroup.ItemGroupName
          }</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ItemGroupMaster = {
              ...itmeGroup,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.pageService
              .DeleteItmeGroup(itmeGroup.ItemGroupID)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  this.loadItem(this.tableParameters);
                  if (response.IsSuccess) {
                    // this.loaditmeGroup();//============
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
        this.formService.createNullObject<ItemGroupMaster>()
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
                const model: ItemGroupMaster = {
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

  //===============================
}
