import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { IndexTableComponent, IndexTableParams } from '../../../../../shared/components/index-table/index-table.component';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { AddBedComponent } from '../add-bed/add-bed.component';
import { CreateComponent } from '../create/create.component';
import { WardMaster, WardMaster_AddWardBed, WardMasterList } from '../ward-master';
import { WardMasterService } from '../ward-master.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [IndexTableComponent, CreateComponent, CommonModule, AddBedComponent],
  providers: [FormValidationService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(CreateComponent) createSidebar!: CreateComponent;
  @ViewChild(AddBedComponent) AddBedSidebar!: AddBedComponent;
  @ViewChild('wardMasterCodeTemplate', { static: true }) wardMasterCodeTemplate!: TemplateRef<any>;
  @ViewChild('wardMasterActiveStatusTemplate', { static: true }) wardMasterActiveStatusTemplate!: TemplateRef<any>;
  @ViewChild('addBedTemplate', { static: true }) addBedTemplate!: TemplateRef<any>;

  tableDef!: IndexTableParams<WardMasterList>;
  tableParameters!: TableLazyLoadEvent;

  constructor(
    private pageService: WardMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Send the template to the page header
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);

    this.tableDef = {
      columnDef: [],
      defaultSortColumn: { sortField: '', sortOrder: 1 },
      data: [],
      totalRecords: 0,
      loading: false
    };

    this.tableDef.columnDef = [
      { data: 'WardID', visible: false, orderable: false },
      { data: 'WardCode', label: 'Code', customTemplate: this.wardMasterCodeTemplate },
      { data: 'WardName', label: 'Ward Name' },
      { data: 'FloorNo', label: 'Floor No' },
      { data: 'BlockName', label: 'Block Name' },
      { data: 'RoomTypeName', label: 'Room Type' },
      { data: 'WardType', label: 'Ward Type' },
      { data: 'TotalBeds', label: 'Total Beds', cssClass: 'text-center', orderable: false },
      { data: 'DisplayOrder', label: 'Display Order', cssClass: 'text-center'},
      { data: '', orderable: false, cssClass: 'text-center', customTemplate: this.addBedTemplate },
      { data: 'ActiveStatus', label: 'Status', cssClass: 'text-center', customTemplate: this.wardMasterActiveStatusTemplate }
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

  onCloseAddbedSidebar(): void {
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
    } catch (error) {

    }
  }

  onClickPageHeaderAddButton(): void {
    if (this.createSidebar) {
      this.createSidebar.openSidebar(true, false, this.formService.createNullObject<WardMaster>());
    }
  }

  onClickPageHeaderAddBedDetails(): void {
    this.router.navigate(['/Admin/WardMaster/ward-bed-details']);
  }

  onClickPageHeaderWardBedUnitMapping(): void {
    this.router.navigate(['/Admin/WardMaster/Ward-bed-unit-mapping']);
  }

  onClickAddBed(WardID: number): void {
    const WardBed_WardID = WardID
    if (this.AddBedSidebar) {
      this.AddBedSidebar.openSidebar(WardBed_WardID, this.formService.createNullObject<WardMaster_AddWardBed>());
    }
  }
  
  onClickEditDetails(ServiceCategoryID: number, ActiveStatus: boolean) {
    try {
      if (this.createSidebar && ServiceCategoryID) {
        this.pageService.GetDetails(ServiceCategoryID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model: WardMaster = {
                  ...response.Data,
                  EffectiveFromDate: DateUtils.toDate(response.Data.EffectiveFromDate),
                  TermEndDate: DateUtils.toDate(response.Data.TermEndDate)
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
        text: `Do you really want to ${ActionType} the "<b>${row.ServiceCategoryName}</b>"?`,
      })
        .then(result => {
          if (result.isConfirmed) {
            const model: WardMaster = {
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
