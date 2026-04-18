import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { CreateComponent } from '../create/create.component';
import { Currency_IndexTableFilter, Currency_IndexTableList, CurrencyMaster } from '../currency-master';
import { CurrencyMasterService } from '../currency-master.service';
import { CurrencyDataviewComponent } from '../dataview/dataview.component';
import { CurrencyGridviewComponent } from '../gridview/gridview.component';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, CreateComponent, CurrencyGridviewComponent, CurrencyDataviewComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent, { static: false }) createSidebar!: CreateComponent;
  @ViewChild(CurrencyGridviewComponent, { static: false }) gridview?: CurrencyGridviewComponent;
  @ViewChild(CurrencyDataviewComponent, { static: false }) dataview?: CurrencyDataviewComponent;

  viewType = signal<'card' | 'table'>('table');
  filterForm!: FormGroup;
  sortingForm!: FormGroup;

  constructor(
    private pageHeaderService: PageHeaderService,
    private pageService: CurrencyMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    const savedView = localStorage.getItem('currencyMasterViewType');
    if (savedView === 'card' || savedView === 'table') {
      this.viewType.set(savedView);
    }

    this.filterForm = this.formService.createFormGroup_DataTableFilter<Currency_IndexTableFilter>(
      this.pageService.getFormConfig_DataTableFilter()
    );

    this.sortingForm = this.formService.createFormGroup_DataTableFilter({
      CurrencyCode: 1,
      CountryName: 0,
      CurrencyName: 0,
      CurrencySymbol: 0,
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
    localStorage.setItem('currencyMasterViewType', type);
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<CurrencyMaster>());
    }
  }

  onClickEditDetails(payload: { currencyID: number; activeStatus: boolean }): void {
    try {
      if (this.createSidebar && payload.currencyID) {
        this.pageService.GetDetails(payload.currencyID)
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

  onClickDeleteReactivate(row: Currency_IndexTableList): void {
    try {
      const ActionType = row.ActiveStatus ? 'delete' : 'reactivate';
      const inputPlaceholder = row.ActiveStatus ? 'Reason To Delete' : 'Reason To Reactivate';

      this.alertService.showConfirmationWithInput({
        inputPlaceholder: inputPlaceholder,
        text: `Do you really want to ${ActionType} the "<b>${row.CurrencyName}</b>"?`,
      })
      .then(result => {
        if (result.isConfirmed) {
          this.pageService.DeleteReactivate(row.CurrencyID!, result.value)
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
