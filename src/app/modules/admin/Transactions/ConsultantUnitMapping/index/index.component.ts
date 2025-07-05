import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { ZPickListComponent } from '../../../../../shared/components/z-form-controls/z-picklist/z-picklist.component';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ConsultantUnitMasterList } from '../../../settings/ConsultantUnitMaster/consultant-unit-master';
import { ConsultantUnitMasterService } from '../../../settings/ConsultantUnitMaster/consultant-unit-master.service';
import { DepartmentMaster_SelectList } from '../../../settings/DepartmentMaster/department-master';
import { DepartmentMasterService } from '../../../settings/DepartmentMaster/department-master.service';
import { ConsultantUnitMapping, ConsultantUnitMappingList } from '../../ConsultantUnitMapping/consultant-unit-mapping';
import { ConsultantUnitMappingService } from '../consultant-unit-mapping.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ReactiveFormsModule, ZFormControlsModule, CommonModule ],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {

  @ViewChild(ZPickListComponent) IndexComponent!: ZPickListComponent;

  private destroy$ = new Subject<void>();
  isSubmitted: boolean = false;
  isItemMovedToSource: boolean = false;
  isItemMovedToTarget: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ConsultantUnitMapping>;
  ConsultantUnitMapping!: ConsultantUnitMapping
  DepartmentList: DepartmentMaster_SelectList[] = [];
  ConsultantUnitList: ConsultantUnitMappingList[] = [];
  ConsultantMasterList: ConsultantUnitMasterList[] = [];
  ConsultantUnitMappedList: ConsultantUnitMappingList[] = [];
  selectedTarget: number | null = null;
  constructor(
    private pageService: ConsultantUnitMappingService,
    private departmentService: DepartmentMasterService,
    private consultantUnitMasterService: ConsultantUnitMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ConsultantUnitMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadDepartment();
  }

  ngAfterViewInit(): void {
    this.IndexComponent.onTargetSelect.subscribe(event => this.onTargetSelect(event));
    this.IndexComponent.onMoveToSource.subscribe(event => this.onMoveToSource(event));
    this.IndexComponent.onMoveAllToSource.subscribe(event => this.onMoveToSource(event));
    this.IndexComponent.onMoveToTarget.subscribe(event => this.onMoveToTarget(event));
    this.IndexComponent.onMoveAllToTarget.subscribe(event => this.onMoveToTarget(event));
    this.IndexComponent.onActionButtonClick.subscribe(ConsultantUnitMapping => this.makeUnitHead(ConsultantUnitMapping));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartment(): void {
    try {
      this.departmentService.PopulateList('MainDepartment')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            // this.DepartmentList = response.Data.Items;
          }
          else {
            this.DepartmentList = [];
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  onDepartmentChange(): void {
    this.selectedTarget = null;
    this.ConsultantUnitMappedList = [];
    const DepartmentID = this.form.get('DepartmentID')?.value;
    if (DepartmentID) {
      this.loadConsultantUnit(DepartmentID);
      this.loadConsultantMaster(DepartmentID)
      this.form.get('ConsultantUnitID')?.setValue(null);
    }
    else {
      this.ConsultantUnitList = [];
      this.ConsultantMasterList = [];
      this.ConsultantUnitMappedList = [];
    }
  }

  loadConsultantUnit(DepartmentID: number): void {
    try {
      this.pageService.PopulateList(DepartmentID, null, 'DepartmentWiseConsultant', 'p')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.ConsultantUnitList = response.Data.Items;
          }
          else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch(error) {

    }
  }

  loadConsultantMaster(DepartmentID: number): void {
    try {
       this.consultantUnitMasterService.PopulateList(DepartmentID, 'SelectList')
       .pipe(takeUntil(this.destroy$)).subscribe({
         next: (response) => {
           if (response.IsSuccess) {
             this.ConsultantMasterList = response.Data.Items;
           }
           else {
             this.alertService.showServerResponseAlert(response);
           }
         },
       });
    } catch (error) {

    }
  }

  onConsultantMasterChange(): void {
    this.ConsultantUnitMappedList = [];
    this.selectedTarget = null;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
    const DepartmentID = this.form.get('DepartmentID')?.value;
    if (ConsultantUnitID && DepartmentID) {
      this.loadConsultantMasterMapped(DepartmentID, ConsultantUnitID);
      this.form.get('ConsultantID')?.setValue(null);
    } else {
      this.ConsultantUnitMappedList=[];
    }
  }

  loadConsultantMasterMapped(DepartmentID: number, ConsultantUnitID: number): void {
    try {
      this.pageService
        .PopulateList(DepartmentID, ConsultantUnitID, 'UnitMappedConsultant', null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.ConsultantUnitMappedList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  onMoveToTarget(event: any) {
    this.isItemMovedToTarget = event.items.length > 0;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value
    const DepartmentID = this.form.get('DepartmentID')?.value
    if (!ConsultantUnitID) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false
      }
      this.ConsultantUnitMappedList = [];
      this.loadConsultantUnit(DepartmentID);
    }
  }

  onMoveToSource(event: any) {
    this.isItemMovedToSource = event.items && event.items.length > 0;
    const DepartmentID = this.form.get('DepartmentID')?.value;
    if (this.isItemMovedToSource) {
      this.loadConsultantUnit(DepartmentID);
    }
  }

  onTargetSelect(event: any) {
    if (this.selectedTarget === event.items[0].ConsultantID) {
      this.selectedTarget = null;
    } else {
      this.selectedTarget = event.items[0].ConsultantID;
    }
  }

  makeUnitHead(model: ConsultantUnitMapping): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    try {
      model = this.formService.processFormData(this.form.value);
      model.ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
      model.ConsultantID = this.selectedTarget;
      const ActionType = 'MakeUnitHead';
      const modelWithActionType = { ...model, ActionType };
      model.ConsultantMapping = null;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
      return;
    } catch (error) {

    }
  }

  onSubmit(ConsultantMapping: ConsultantUnitMappingList[], model: ConsultantUnitMapping): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false;
        this.isSubmitted = false;
        return;
      }
      model = this.formService.processFormData(this.form.value);
      model.ConsultantUnitID = this.form.get('ConsultantUnitID')?.value;
      const ActionType = this.isItemMovedToSource ? 'Remove' : 'Add';
      const modelWithActionType = { ...model, ActionType };
      modelWithActionType.ConsultantMapping = ConsultantMapping;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
    }
    catch (error) {

    }
  }

  updateRecord(model: ConsultantUnitMapping): void {
    try {
      this.pageService.UpdateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.alertService.showToast({
              type: "success",
              text: response.Message,
              timer: 5000
            });
            this.ReloadMappedList();
          }
          else {
            this.alertService.showServerResponseAlert(response);
          }
        },
        complete: () => {
          this.isSubmitted = false;
        }
      });
    }
    catch (error) {

    }
  }

  ReloadMappedList():void {
    const DepartmentID = this.form.get('DepartmentID')?.value;
    const ConsultantUnitID = this.form.get('ConsultantUnitID')?.value
    if (DepartmentID && ConsultantUnitID && this.ConsultantUnitMappedList.length > 0) {
      this.selectedTarget = null;
      this.isItemMovedToSource = false;
      this.isItemMovedToTarget = false;
      this.loadConsultantMasterMapped(DepartmentID, ConsultantUnitID);
    }
    this.form.get('ConsultantID')?.setValue(null);
  }

}
