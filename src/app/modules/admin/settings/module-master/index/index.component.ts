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
import { ModuleMaster, ModuleMaster_IndexTableFilter, ModuleMaster_IndexTableList, ModuleMaster_IndexTableSort } from '../module-master';
import { ModuleMasterService } from '../module-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, DataviewComponent, GridviewComponent, CreateComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
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
    private pageService: ModuleMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.filterForm = this.formService.createFormGroup_DataTableFilter<ModuleMaster_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );
    this.sortingForm = this.formService.createFormGroup<ModuleMaster_IndexTableSort>(
      this.pageService.getFormConfig_DataTableSort()
    );

    const savedView = localStorage.getItem('adminModuleMasterViewType');
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
    localStorage.setItem('adminModuleMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<ModuleMaster>());
    }
  }

  onClickEditDetails(moduleID: number, activeStatus: boolean): void {
    if (!(this.createSidebar && moduleID)) return;

    this.pageService.GetDetails(moduleID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.createSidebar.openSidebar(activeStatus, true, response.Data);
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        }
      });
  }

  onCloseSidebar(): void {
    this.refreshActiveView();
  }

  onClickDeleteReactivate(row: ModuleMaster_IndexTableList): void {
    const actionType = row.ActiveStatus ? 'delete' : 'reactivate';
    const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

    this.alertService.showConfirmationWithInput({
      inputPlaceholder,
      text: `Do you really want to ${actionType} the "<b>${row.ModuleName}</b>"?`
    }).then(result => {
      if (!result.isConfirmed) return;

      const model: ModuleMaster = {
        ...row,
        ActionType: actionType,
        ReasonToUpdate: result.value
      } as unknown as ModuleMaster;

      this.pageService.DeleteReactivate(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.refreshActiveView();
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    });
  }

  private refreshActiveView(): void {
    if (this.viewType() === 'card') {
      this.dataview?.reload();
    } else {
      this.gridview?.reload();
    }
  }
}
