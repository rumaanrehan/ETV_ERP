import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PickListModule } from 'primeng/picklist';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { TestGroupMapping, TestGroupMappingList } from '../test-group-mapping';
import { TestGroupMappingService } from '../test-group-mapping.service';

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
  formConfig!: FormConfigType<TestGroupMapping>;
  TestGroupList: TestGroupMappingList[] = [];
  TestGroupMapping!: TestGroupMapping;
  ServiceCategoryList: TestGroupMappingList[] = [];
  ServiceCategoryMappedList: TestGroupMappingList[] = [];

  constructor(
    private pageService: TestGroupMappingService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<TestGroupMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.loadTestGroup();
    this.loadServiceCategory();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/LB/TestGroupMaster/Index']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTestGroup(): void {
    try {
      this.pageService.PopulateList( null, 'SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.TestGroupList = response.Data.Items;
            }
            else {
              this.TestGroupList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadServiceCategory(): void {
    try {
      this.pageService.PopulateList(null, 'AllCategory')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ServiceCategoryList = response.Data.Items;
            }
            else {
              this.ServiceCategoryList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadServiceCategoryMapped(TestGroupID: number): void {
    try {
      this.pageService.PopulateList(TestGroupID,'MappedCategory')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ServiceCategoryMappedList = response.Data.Items;
            }
            else {
              this.ServiceCategoryMappedList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onTestGroupChange(): void {
    this.ServiceCategoryMappedList = [];
    const TestGroupID = this.form.get('TestGroupID')?.value;
    if (TestGroupID) {
      this.loadServiceCategoryMapped(TestGroupID)
      this.form.get('TestMethodID')?.setValue(null);
    } else {
      this.ServiceCategoryMappedList = [];
    }
  }

  onMoveToTarget(event: any) {
    this.isItemMovedToTarget = event.items.length > 0;
    const TestGroupID = this.form.get('TestGroupID')?.value
    if (!TestGroupID) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false
      }
      this.ServiceCategoryMappedList= [];
      this.loadTestGroup();
    }
  }

  onMoveToSource(event: any) {
    this.isItemMovedToSource = event.items && event.items.length > 0;
    if (this.isItemMovedToSource) {
      this.loadTestGroup();
    }
  }

  onSubmit(TestMapping: TestGroupMappingList[], model: TestGroupMapping): void {
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
      model.TestGroupID = this.form.get('TestGroupID')?.value;
      const ActionType = this.isItemMovedToSource ? 'Remove' : 'Add';
      const modelWithActionType = { ...model, ActionType };
      modelWithActionType.TestMapping = TestMapping;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
    }
    catch (error) {

    }
  }

  updateRecord(model: TestGroupMapping): void {
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

  ReloadMappedList(): void {
    const TestGroupID = this.form.get('TestGroupID')?.value;
    if (TestGroupID && this.ServiceCategoryMappedList.length > 0) {
      this.isItemMovedToSource = false;
      this.isItemMovedToTarget = false;
      this.loadServiceCategoryMapped(TestGroupID);
    }
    this.form.get('TestMethodID')?.setValue(null);
  }

}
