import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ConsultantUnitMasterList } from '../../ConsultantUnitMaster/consultant-unit-master';
import { ConsultantUnitMasterService } from '../../ConsultantUnitMaster/consultant-unit-master.service';
import { DepartmentMasterList } from '../../DepartmentMaster/department-master';
import { DepartmentMasterService } from '../../DepartmentMaster/department-master.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { UpdateMappingComponent } from '../update-mapping/update-mapping.component';
import { WardMaster_WardBedUnitMapping, WardMaster_WardBedUnitMappingList, WardMasterList } from '../ward-master';
import { WardMasterService } from '../ward-master.service';

@Component({
  selector: 'app-ward-bed-unit-mapping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, FieldsetModule, TableModule, UpdateMappingComponent],
  providers: [FormService, DatePipe],
  templateUrl: './ward-bed-unit-mapping.component.html',
  styleUrl: './ward-bed-unit-mapping.component.scss'
})
export class WardBedUnitMappingComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild(UpdateMappingComponent) UpdateMapping!: UpdateMappingComponent;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<WardMaster_WardBedUnitMapping>;
  viewByList: SelectList[] = [];
  StatusList: SelectList[] = [];
  DepartmentList: DepartmentMasterList[] = [];
  ConsultantUnitList: ConsultantUnitMasterList[] = [];
  wardlist: WardMasterList[] = [];
  model!: WardMaster_WardBedUnitMapping;
  WardMaster_WardBedUnitMappingList: WardMaster_WardBedUnitMappingList[] = [];
  constructor(
    private pageService: WardMasterService,
    private departmentMasterService: DepartmentMasterService,
    private consultantUnitMasterService: ConsultantUnitMasterService,
    private selectListService: SelectListService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormBedUnitMappingDetailsConfig();
    this.form = this.formService.createFormGroup<WardMaster_WardBedUnitMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadSelectListData('WardBedUnitMapping_ViewBy', 'viewByList');
    this.loadSelectListData('StatusID', 'StatusList'); 
    this.loadDepartment();
    this.loadWardBedDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get WardBedUnitMappingArray(): FormArray {
    return this.form.get('WardBedUnitMapping') as FormArray;
  }

  onViewByChange(event: DropdownChangeEvent) {
    this.WardBedUnitMappingArray.clear();

    const ViewBy = this.form.get('ViewBy')?.value;
    const DepartmentID = this.form.get('DepartmentID')?.value;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
    const WardID = this.form.get('WardID')?.value;
    const StatusID = this.form.get('StatusID')?.value;
    if (ViewBy == 1) {
      this.loadWardUnitMapping(ViewBy, DepartmentID, ConsultantUnitID, StatusID);
    } else if (ViewBy == 2 && WardID > 0) {
      this.loadWardUnitMapping(ViewBy, 0, 0, WardID, StatusID);
    }
  }

  loadSelectListData(FieldName: string, targetList: keyof WardBedUnitMappingComponent) {
    try {
      this.selectListService.PopulateList('Admin', 'WardMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              (this[targetList] as SelectList[]) = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadDepartment(): void {
    try {
      this.departmentMasterService.PopulateList(0, 'SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.DepartmentList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  onDepartmentChange(event: DropdownChangeEvent): void {
    this.form.patchValue({
      ConsultantUnitID: 0
    });
    const DepartmentID = this.form.get('DepartmentID')?.value;
    const ViewBy = this.form.get('ViewBy')?.value;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
    const StatusID = this.form.get('StatusID')?.value;
    if (DepartmentID ) {
      this.loadConsultantUnit(DepartmentID);

      if (ViewBy > 0 && DepartmentID > 0 && ConsultantUnitID >= 0 && StatusID >= 0) {
        this.loadWardUnitMapping(ViewBy, DepartmentID, ConsultantUnitID, StatusID);
      } else {
        this.WardBedUnitMappingArray.clear();
      }
    } else {
      this.ConsultantUnitList = [];
      this.WardBedUnitMappingArray.clear();
    }
  }

  loadConsultantUnit(DepartmentID: number): void {
    try {
      this.consultantUnitMasterService.PopulateList(DepartmentID,'SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.ConsultantUnitList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }
  
  loadWardBedDetails(): void {
    try {
      this.pageService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.wardlist = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }
 
  onWardChange(event: DropdownChangeEvent): void {
    const ViewBy = this.form.get('ViewBy')?.value;
    const WardID = this.form.get('WardID')?.value;
    const StatusID = this.form.get('StatusID')?.value;
    if (ViewBy > 0  && WardID > 0 && StatusID >= 0) {
      this.loadWardUnitMapping( ViewBy, 0, 0, WardID, StatusID);
    } else {
      this.WardBedUnitMappingArray.clear();
    }
  }

  onConsultantUnitChange(event: DropdownChangeEvent): void {
    const ViewBy = this.form.get('ViewBy')?.value;
    const DepartmentID = this.form.get('DepartmentID')?.value;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
    const StatusID = this.form.get('StatusID')?.value;
    if (ViewBy > 0 && DepartmentID > 0 && ConsultantUnitID >= 0 && StatusID >= 0) {
      this.loadWardUnitMapping( ViewBy, DepartmentID, ConsultantUnitID, StatusID);
    } else {
      this.WardBedUnitMappingArray.clear();
    }
  }

  onStatusChange(event: DropdownChangeEvent): void {
    const ViewBy = this.form.get('ViewBy')?.value;
    const DepartmentID = this.form.get('DepartmentID')?.value;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
    const WardID = this.form.get('WardID')?.value;
    const StatusID = this.form.get('StatusID')?.value;
    if (ViewBy > 0 && DepartmentID > 0 && ConsultantUnitID >= 0 && StatusID >= 0) {
      this.loadWardUnitMapping(ViewBy, DepartmentID, ConsultantUnitID,WardID, StatusID);
    } else if (ViewBy > 0 && WardID > 0 && StatusID >= 0) {
      this.loadWardUnitMapping(ViewBy, WardID, StatusID);
    }
    else {
      this.WardBedUnitMappingArray.clear();
    }
  }

  loadWardUnitMapping(ViewBy?: number, DepartmentID?: number, ConsultantUnitID?: number, WardID?: number, StatusID?: number) {
    try {
      this.pageService.WardBedUnitMappingGetDetailsAsync(ViewBy, DepartmentID, ConsultantUnitID, WardID, StatusID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.WardBedUnitMappingArray.clear();
              this.WardMaster_WardBedUnitMappingList = response.Data.Items;
              this.WardMaster_WardBedUnitMappingList.forEach(() => {
                this.WardBedUnitMappingArray.push(this.formService.createFormArrayItem(this.formConfig.WardBedUnitMapping.items));
              });
              this.form.patchValue({
                WardBedUnitMapping: this.WardMaster_WardBedUnitMappingList
              });
            }
            else {
              this.WardBedUnitMappingArray.clear();
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    }
    catch (error) {

    }
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/WardMaster/Index']);
  }

  onClickUpdateMapping(): void {
    if (this.UpdateMapping) {
      this.UpdateMapping.openSidebar(this.formService.createNullObject<WardMaster_WardBedUnitMapping>());
    }
  }
}
