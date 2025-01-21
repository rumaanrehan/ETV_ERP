import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ConsultantUnitMasterList } from '../../ConsultantUnitMaster/consultant-unit-master';
import { ConsultantUnitMasterService } from '../../ConsultantUnitMaster/consultant-unit-master.service';
import { DepartmentMasterList } from '../../DepartmentMaster/department-master';
import { DepartmentMasterService } from '../../DepartmentMaster/department-master.service';
import { WardMaster_WardBedUnitMapping, WardMasterList } from '../ward-master';
import { WardMasterService } from '../ward-master.service';

@Component({
  selector: 'app-update-mapping',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule, FieldsetModule, TableModule],
  templateUrl: './update-mapping.component.html',
  styleUrl: './update-mapping.component.scss'
})
export class UpdateMappingComponent {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<WardMaster_WardBedUnitMapping>;
  DepartmentList: DepartmentMasterList[] = [];
  ConsultantUnitList: ConsultantUnitMasterList[] = [];
  wardlist: WardMasterList[] = [];
  constructor(
    private pageService: WardMasterService,
    private departmentMasterService: DepartmentMasterService,
    private consultantUnitMasterService: ConsultantUnitMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormBedUnitMappingDetailsConfig();
    this.form = this.formService.createFormGroup<WardMaster_WardBedUnitMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadDepartment();
    this.loadWardBedDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    const DepartmentID = this.form.get('DepartmentID')?.value;
    if (DepartmentID) {
      this.loadConsultantUnit(DepartmentID);
    } else {
      this.ConsultantUnitList = [];
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

  openSidebar(model: WardMaster_WardBedUnitMapping): void {
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    const KeepOpenWardBedUnitMappingModal = this.form.get('KeepOpenWardBedUnitMappingModal')?.value
    if (KeepOpenWardBedUnitMappingModal == true) {
      this.isFormSidebarVisible = true
    } else {
      this.isFormSidebarVisible = false;
    }
   
   this.formService.resetFormValue<WardMaster_WardBedUnitMapping>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;

    try {
      // Handle invalid form
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }

      // Handle form submission based on editMode
      if (this.isEditMode) {
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            const model: WardMaster_WardBedUnitMapping = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.WardBedUnitMapping_UpdateRecord(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  WardBedUnitMapping_UpdateRecord(model: WardMaster_WardBedUnitMapping): void {
    try {
      this.pageService.WardBedUnitMapping_UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeSidebar();
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              });
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    } catch (error) {

    }
  }
}
