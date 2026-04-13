import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { DataviewComponent } from '../dataview/dataview.component';
import { GridviewComponent } from '../gridview/gridview.component';
import { ProductMaster, Product_IndexTableList, Product_IndexTableSort, Product_IndexTableFilter } from '../product-master';
import { ProductMasterService } from '../product-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, DataviewComponent, GridviewComponent, CreateComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild(DataviewComponent) dataview?: DataviewComponent;
  @ViewChild(GridviewComponent) gridview?: GridviewComponent;

  viewType = signal<'card' | 'table'>('card');
  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: ProductMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterForm = this.formService.createFormGroup_DataTableFilter<Product_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );
    this.sortingForm = this.formService.createFormGroup<Product_IndexTableSort>(
      this.pageService.getFormConfig_DataTableSort()
    );

    const savedView = localStorage.getItem('imsProductMasterViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageHeaderService.setTemplate(null);
  }

  toggleView(type: 'card' | 'table'): void {
    this.viewType.set(type);
    localStorage.setItem('imsProductMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ProductMaster>());
    }
  }

  onClickEditDetails(productID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && productID) {
        this.pageService.GetDetails(productID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: ProductMaster = {
                  ...response.Data
                };

                this.createSidebar.openSidebar(activeStatus, true, model);
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

  onCloseSidebar(): void {
    this.refreshActiveView();
  }

  onClickDeleteReactivate(row: Product_IndexTableList): void {
    try {
      const ActionType = row.ActiveStatus ? 'Delete' : 'Reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService
        .showConfirmationWithInput({
          inputPlaceholder: inputPlaceholder,
          text: `Do you really want to <b>${ActionType.toUpperCase()}</b> the "<b>${row.ProductName}</b>"?`,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.pageService.DeleteReactivate(row.ProductID!, result.value)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (response) => {
                  if (response.IsSuccess) {
                    this.refreshActiveView();
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
    }
    catch (error) { }
  }

  private refreshActiveView(): void {
    if (this.viewType() === 'card') {
      this.dataview?.reload();
    } else {
      this.gridview?.reload();
    }
  }
}
