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
import { TaxSlabMaster, TaxSlab_IndexTableFilter, TaxSlab_IndexTableList, TaxSlab_IndexTableSort } from '../tax-slab-master';
import { TaxSlabMasterService } from '../tax-slab-master.service';

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
    private pageService: TaxSlabMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterForm = this.formService.createFormGroup_DataTableFilter<TaxSlab_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );
    this.sortingForm = this.formService.createFormGroup<TaxSlab_IndexTableSort>(
      this.pageService.getFormConfig_DataTableSort()
    );

    const savedView = localStorage.getItem('adminTaxSlabMasterViewType');
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
    localStorage.setItem('adminTaxSlabMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<TaxSlabMaster>());
    }
  }

  onClickEditDetails(taxSlabID: number, activeStatus: boolean): void {
    try {
      if (this.createSidebar && taxSlabID) {
        this.pageService.GetDetails(taxSlabID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: TaxSlabMaster = {
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

  onClickDeleteReactivate(row: TaxSlab_IndexTableList): void {
     try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.TaxSlabName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.TaxSlabID, result.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.refreshActiveView();
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

  private refreshActiveView(): void {
    if (this.viewType() === 'card') {
      this.dataview?.reload();
    } else {
      this.gridview?.reload();
    }
  }
}
