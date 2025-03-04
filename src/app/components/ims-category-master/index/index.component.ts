import { CategoryMaster } from './../CategoryMaster';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import {
  IndexTableComponent,
  IndexTableParams,
} from '../../../shared/components/index-table/index-table.component';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../shared/services/form.service';
import { PageHeaderService } from '../../../shared/services/page-header.service';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
// import { CategoryMaster } from '../CategoryMaster';
import { Router } from '@angular/router';
import { IMS_CategoryMasterService } from '../IMS_CatergoryMasterService';
import { CreateComponent } from '../create/create.component';
import { Create_ProductMasterComponent } from '../../product-master/create/create.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    IndexTableComponent,
    CommonModule,
    Create_ProductMasterComponent,
    CreateComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService, DatePipe],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true })
  pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;

  @ViewChild('CategoryIDTemplate', { static: true })
  CategoryIDTemplate!: TemplateRef<any>;

  @ViewChild('CategoryCodeTemplate', { static: true })
  CategoryCodeTemplate!: TemplateRef<any>;

  @ViewChild('CategoryNameTemplate', { static: true })
  CategroyNameTemplate!: TemplateRef<any>;

  @ViewChild('CategoryTypeTemplate', { static: true })
  CategoryTypeTemplate!: TemplateRef<any>;

  @ViewChild('IsActiveTemplate', { static: true })
  IsActiveTemplate!: TemplateRef<any>;

  @ViewChild('CreatedByDateInTemplate', { static: true })
  CreatedDateTime!: TemplateRef<any>;

  @ViewChild('ModifyByDateInTemplate', { static: true })
  ModifiedDateTime!: TemplateRef<any>;

  @ViewChild('actionColTemplate', { static: true })
  actionColTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<CategoryMaster>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private router: Router,
    private componentService: IMS_CategoryMasterService,
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
          data: 'CategoryId',
          visible: false,
          orderable: false,
          customTemplate: this.CategoryIDTemplate,
        },
        {
          data: 'CategoryCode',
          label: 'Code',
          customTemplate: this.CategoryCodeTemplate,
        },
        {
          data: 'CategoryName',
          label: 'Name',
          // orderable: false,
          customTemplate: this.CategroyNameTemplate,
        },
        // {
        //   data: 'CategoryType',
        //   label: 'Type',
        //   orderable: false,
        //   cssClass: 'text-center',
        //   customTemplate: this.CategoryTypeTemplate,
        // },
        {
          data: 'IsActive',
          label: 'Status',
          // orderable: false,
          cssClass: 'text-center',
          customTemplate: this.IsActiveTemplate,
        },
        {
          data: 'CreatedDateTime',
          label: 'CreatedDateTime ',
          // orderable: false,
          cssClass: 'text-center',
          customTemplate: this.CreatedDateTime,
        },
        {
          data: 'ModifiedDateTime',
          label: 'ModifiedDateTime',
          // orderable: false,
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
    // this.loadCategory(this.tableParameters);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategory(tableParameters: TableLazyLoadEvent) {
    // this.tableDef.loading = true;
    console.log(tableParameters)
    this.componentService
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
    this.loadCategory(this.tableParameters);
  }

  onClickEditDetails(categoryCode: string, ActiveStatus: boolean) {
    this.createSidebar.Id = Number(categoryCode);
    console.log(categoryCode, '......edit is clickd');
    // this.router.navigate([`/IMS/CategoryMaster/Edit/${categoryCode}`]);
    try {
      if (this.createSidebar && categoryCode) {
        this.componentService
          .GetDetails(categoryCode)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: CategoryMaster = {
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

  onClickPageHeaderAddButton() {
    console.log('add');
    // this.router.navigate(['/IMS/CategoryMaster/Create']);
    console.log(this.createSidebar);
    if (this.createSidebar) {
      this.createSidebar.openSidebar(
        true,
        false,
        this.formService.createNullObject<CategoryMaster>()
      );
    }
  }

  onCloseSidebar(): void {
    this.loadCategory(this.tableParameters);
  }

  onClickDelete(category: any) {
    console.log('I want to delete this: ' + category.CategoryID);
    try {
      const ActionType = 'Delete';
      const inputPlaceholder = 'Reason to Delete';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${
            category.CategoryName
          }</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const model: CategoryMaster = {
              ...category,
              ActionType: ActionType,
              ReasonToUpdate: result.value,
            };

            this.componentService
              .DeleteCategory(category.CategoryID)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  this.loadCategory(this.tableParameters);
                  if (response.IsSuccess) {
                    // this.loadCategory();//============
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
                  console.error('Error deleting product:', err);
                  this.alertService.showAlert({
                    type: 'error',
                    text: 'Failed to delete product. Please try again later.',
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
}
