import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { ServiceMasterList } from '../../ServiceMaster/service-master';
import { ServiceMasterService } from '../../ServiceMaster/service-master.service';
import { ProfileTestMapping, ProfileTestMappingList } from '../profile-test-mapping';
import { ProfileTestMappingService } from '../profile-test-mapping.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ReactiveFormsModule, ZFormControlsModule, PickListModule, CommonModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  private destroy$ = new Subject<void>();
  isSubmitted: boolean = false;
  isItemMovedToSource: boolean = false;
  isItemMovedToTarget: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ProfileTestMapping>;
  ProfileTestMapping!: ProfileTestMapping;
  ProfileTestList: ServiceMasterList[] = [];
  ProfileTestMappedList: any[] = [];
  ProfileList: ServiceMasterList[] = [];

  constructor(
    private pageService: ProfileTestMappingService,
    private serviceMasterService: ServiceMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ProfileTestMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    try {
      this.serviceMasterService.PopulateList(null, null,'AllProfile')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ProfileList = response.Data.Items;
            }
            else {
              this.ProfileList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onProfileChange(): void {
    const ProfileID = this.form.get('ProfileID')?.value;
    this.loadProfileTest(ProfileID);
    this.loadProfileTestMapped(ProfileID);
    this.updateTestMappedCount();
  }

  loadProfileTest(ProfileID: number): void {
    try {
      this.serviceMasterService.PopulateList(ProfileID, null,'ProfileCategoryTest')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ProfileTestList = response.Data.Items;
            }
            else {
              this.ProfileTestList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadProfileTestMapped(ProfileID: number): void {
    try {
      this.serviceMasterService
        .PopulateList(ProfileID, null, 'ProfileMappedTest')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ProfileTestMappedList = response.Data.Items;
            } else {
              this.ProfileTestMappedList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  updateTestMappedCount(): void {
    setTimeout(() => {
      const count = this.ProfileTestMappedList.length;
      this.form.get('TotalMappedTest')?.setValue(count > 0 ? count : null);
    }, 200);
  }

  onMoveToTarget(event: any) {
    this.isItemMovedToTarget = event.items.length > 0;
    const ProfileID = this.form.get('ProfileID')?.value
    if (!ProfileID) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false
      }
      this.ProfileTestMappedList = [];
      this.loadProfileTest(ProfileID);
    }
  }

  onMoveToSource(event: any) {
    const ProfileID = this.form.get('ProfileID')?.value
    this.isItemMovedToSource = event.items && event.items.length > 0;
    if (this.isItemMovedToSource) {
      this.loadProfileTest(ProfileID);
    }
  }

  onSubmit(TestMapping: ProfileTestMappingList[], model: ProfileTestMapping): void {
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
      TestMapping = this.ProfileTestMappedList.map(item => ({
        TestID: item.ServiceID,
        ActionType: this.isItemMovedToSource ? 'Remove' : 'Add'
      }));
      model = this.formService.processFormData(this.form.value);
      model.ProfileID = this.form.get('ProfileID')?.value;
      const ActionType = this.isItemMovedToSource ? 'Remove' : 'Add';
      const modelWithActionType = { ...model, ActionType };
      modelWithActionType.TestMapping = TestMapping;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
    }
    catch (error) {

    }
  }

  updateRecord(model: ProfileTestMapping): void {
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
              this.updateTestMappedCount();
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

  ReloadMappedList(): void {
    const ProfileID = this.form.get('ProfileID')?.value;
    if (ProfileID && this.ProfileTestMappedList.length > 0) {
      this.isItemMovedToSource = false;
      this.isItemMovedToTarget = false;
      this.loadProfileTestMapped(ProfileID);
    }
    this.form.get('TestMethodID')?.setValue(null);
  }

}
