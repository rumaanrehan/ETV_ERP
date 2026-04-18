import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { ItemCategory_IndexFilter, ItemCategory_IndexList, ItemCategoryMaster } from '../item-category-master';
import { ItemCategoryMasterService } from '../item-category-master.service';
import { ItemCategoryGridviewComponent } from '../gridview/gridview.component';
import { ItemCategoryDataviewComponent } from '../dataview/dataview.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CreateComponent, ItemCategoryGridviewComponent, ItemCategoryDataviewComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [FormValidationService],
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild(ItemCategoryGridviewComponent, { static: false }) gridview?: ItemCategoryGridviewComponent;
  @ViewChild(ItemCategoryDataviewComponent, { static: false }) dataview?: ItemCategoryDataviewComponent;

  viewType = signal<'card' | 'table'>('table');
  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('itemCategoryMasterViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<ItemCategory_IndexFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );

    this.sortingForm = this.formService.createFormGroup_DataTableFilter({
      ItemCategoryCode: 1,
      ItemCategoryName: 0,
      ActiveStatusID: 0
    });

    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageHeaderService.setTemplate(null);
  }

  toggleView(type: 'card' | 'table'): void {
    this.viewType.set(type);
    localStorage.setItem('itemCategoryMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ItemCategoryMaster>());
    }
  }

  onClickEditDetails(payload: { itemCategoryID: number; activeStatus: boolean }): void {
    try {
      if (this.createSidebar && payload.itemCategoryID) {
        this.pageService
          .GetDetails(payload.itemCategoryID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ItemCategoryMaster = {
                  ...response.Data,
                };
                this.createSidebar.openSidebar(payload.activeStatus, true, model);
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
      }
    } catch (error) { }
  }

  onCloseSidebar(): void {
    if (this.viewType() === 'card') {
      this.dataview?.loadData();
    } else {
      this.gridview?.loadData();
    }
  }

  onClickDeleteReactivate(row: any) {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';
      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.ItemCategoryName}</b>"?`,
      })
        .then((result) => {
          if (result.isConfirmed) {
            this.pageService.DeleteReactivate(row.ItemCategoryID!, result.value)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  if (response.IsSuccess) {
                    if (this.viewType() === 'card') {
                      this.dataview?.loadData();
                    } else {
                      this.gridview?.loadData();
                    }
                    this.alertService.showAlert({
                      type: 'success',
                      text: response.Message,
                      timer: 5000,
                    });
                  } else {
                    this.alertService.showServerResponseAlert(response);
                  }
                },
              });
          }
        });
    } catch (error) { }
  }
}
