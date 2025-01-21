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
import { ServiceMasterList } from '../../ServiceMaster/service-master';
import { ServiceMasterService } from '../../ServiceMaster/service-master.service';
import { TestMethodList } from '../../TestMethod/test-method';
import { TestMethodService } from '../../TestMethod/test-method.service';
import { TestMethodMapping, TestMethodMappingList } from '../test-method-mapping';
import { TestMethodMappingService } from '../test-method-mapping.service';

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
  formConfig!: FormConfigType<TestMethodMapping>;
  TestMethodMapping!: TestMethodMapping;
  selectedTarget: number | null = null;
  TestMethodList: TestMethodList[] = [];
  TestMethodMappedList: TestMethodMappingList[] = [];
  TestList: ServiceMasterList[] = [];

  constructor(
    private pageService: TestMethodMappingService,
    private testMethodService: TestMethodService,
    private serviceMasterService: ServiceMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<TestMethodMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.loadTest();
    this.loadTestMethod();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/LB/TestMethod/Index']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTest(): void {
    try {
      this.serviceMasterService.PopulateList(null,null,'TestMethod')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.TestList = response.Data.Items;
            }
            else {
              this.TestMethodList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadTestMethod(): void {
    try {
      this.testMethodService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.TestMethodList = response.Data.Items;
            }
            else {
              this.TestMethodList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onTestChange(): void {
    this.selectedTarget = null;
    this.TestMethodMappedList = [];
    const TestID = this.form.get('TestID')?.value;
    if (TestID) {
      this.loadTestMethodMapped(TestID);
      this.form.get('TestMethodID')?.setValue(null);
      setTimeout(() => {
        this.updateMappedMethodCount();
      }, 200);
    } else {
      this.TestMethodMappedList = [];
      setTimeout(() => {
        this.updateMappedMethodCount();
      }, 200);
    }
  }

  updateMappedMethodCount(): void {
    const count = this.TestMethodMappedList.length;
    this.form.get('TotalMappedMethod')?.setValue(count > 0 ? count : null);
  }

  loadTestMethodMapped(TestID: number): void {
    try {
      this.pageService
        .PopulateList(TestID, 'MappedTestMethod')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.TestMethodMappedList = response.Data.Items;
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
    const TestID = this.form.get('TestID')?.value
    const DepartmentID = this.form.get('DepartmentID')?.value
    if (!TestID) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false
      }
      this.TestMethodMappedList = [];
      this.loadTestMethod();
    }
  }

  onMoveToSource(event: any) {
    this.isItemMovedToSource = event.items && event.items.length > 0;
    if (this.isItemMovedToSource) {
      this.loadTestMethod();
    }
  }

  onTargetSelect(event: any) {
    if (this.selectedTarget === event.items[0].TestMethodID) {
      this.selectedTarget = null;
    } else {
      this.selectedTarget = event.items[0].TestMethodID;
    }
  }

  onSubmit(TestMapping: TestMethodMappingList[], model: TestMethodMapping): void {
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
      model.TestID = this.form.get('TestID')?.value;
      const ActionType = this.isItemMovedToSource ? 'Add' : 'Remove';
      const modelWithActionType = { ...model, ActionType };
      modelWithActionType.TestMapping = TestMapping;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
    }
    catch (error) {

    }
  }

  makeDefault(model: TestMethodMapping): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    try {
      model = this.formService.processFormData(this.form.value);
      model.TestMethodID = this.form.get('TestMethodID')?.value;
      model.TestMethodID = this.selectedTarget;
      const ActionType = 'MakeDefault';
      const modelWithActionType = { ...model, ActionType };
      model.TestMapping = null;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
      return;
    } catch (error) {

    }
  }

  updateRecord(model: TestMethodMapping): void {
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
              setTimeout(() => {
                this.updateMappedMethodCount();
              }, 100);
              this.ReloadMappedList();
              this.updateMappedMethodCount();
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
    const TestID = this.form.get('TestID')?.value;
    if (TestID && this.TestMethodMappedList.length > 0) {
      this.selectedTarget = null;
      this.isItemMovedToSource = false;
      this.isItemMovedToTarget = false;
      this.loadTestMethodMapped(TestID);
    }
    this.form.get('TestMethodID')?.setValue(null);
  }

}
