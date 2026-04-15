import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CreateComponent } from '../create/create.component';
import { Company_IndexTableFilter, Company_IndexTableList, CompanyMaster } from '../company-master';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CompanyMasterService } from '../company-master.service';
import { FormService } from '../../../../../shared/services/form.service';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { CompanyGridviewComponent } from '../gridview/gridview.component';
import { CompanyDataviewComponent } from '../dataview/dataview.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CreateComponent, CompanyGridviewComponent, CompanyDataviewComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;
  @ViewChild(CompanyGridviewComponent, { static: false }) gridview?: CompanyGridviewComponent;
  @ViewChild(CompanyDataviewComponent, { static: false }) dataview?: CompanyDataviewComponent;

  viewType = signal<'card' | 'table'>('table');
  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: CompanyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('companyMasterViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<Company_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );

    this.sortingForm = this.formService.createFormGroup_DataTableFilter({
      CompanyCode: 1,
      CompanyName: 0,
      CompanyTypeID: 0,
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
    localStorage.setItem('companyMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<CompanyMaster>());
    }
  }

  onClickEditDetails(payload: { companyID: number; activeStatus: boolean }): void {
    try {
      if (this.createSidebar && payload.companyID) {
        this.pageService.GetDetails(payload.companyID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                this.createSidebar.openSidebar(payload.activeStatus, true, response.Data);
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
    if (this.viewType() === 'card') {
      this.dataview?.loadData();
    } else {
      this.gridview?.loadData();
    }
  }

  onClickDeleteReactivate(row: Company_IndexTableList): void {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.CompanyName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            this.pageService.DeleteReactivate(row.CompanyID, result.value)
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
