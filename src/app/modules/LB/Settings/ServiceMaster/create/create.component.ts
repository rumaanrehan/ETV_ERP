import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SelectList } from '../../../../admin/settings/SelectList/select-list';
import { SelectListService } from '../../../../admin/settings/SelectList/select-list.service';
import { ServiceCategoryMasterList } from '../../../../admin/settings/ServiceCategoryMaster/service-category-master';
import { ServiceCategoryMasterService } from '../../../../admin/settings/ServiceCategoryMaster/service-category-master.service';
import { ServiceMaster } from '../service-master';
import { ServiceMasterService } from '../service-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, TableModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ServiceMaster>;

  CategoryList: ServiceCategoryMasterList[] = [];
  TestTypeList: SelectList[] = [];
  ResultTypeList: SelectList[] = [];

  ServiceID: number | null = null; // For Edit Mode

  constructor(
    private pageService: ServiceMasterService,
    private pageHeaderService: PageHeaderService,
    private serviceCategoryMasterService: ServiceCategoryMasterService,
    private selectListservice: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ServiceMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadServiceCategory();
    this.loadTestType('TestType');
    this.loadResultType('ResultType');
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServiceCategory() {
    try {
      this.serviceCategoryMasterService.PopulateList('LB','SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.CategoryList = response.Data.Items;
            }
            else {
              this.CategoryList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  loadTestType(FieldName: string) {
    try {
      this.selectListservice.PopulateList('LB', 'ServiceMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.TestTypeList = response.Data.Items;
            }
            else {
              this.TestTypeList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  loadResultType(FieldName: string) {
    try {
      this.selectListservice.PopulateList('LB', 'ServiceMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.ResultTypeList = response.Data.Items;
            }
            else {
              this.ResultTypeList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  onResultTypeChange(): void {
    this.form.get('IsRangeBounds')?.setValue(false);
    this.form.get('ResultRange_MinValue')?.setValue(null);
    this.form.get('ResultRange_MaxValue')?.setValue(null);
    this.form.get('ResultRange_ReferenceValue')?.setValue(null);
    this.LabelArray.clear();
  }

  onSubmit(): void {

    const ResultType = this.form.get('ResultType')?.value;
    const LabelArray = this.form.get('LabelArray')?.value;

      if (this.isSubmitted) return;

      this.isSubmitted = true;

      try {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          this.formService.validateFormFields(this.formConfig, this.form);
          this.alertService.showValidationAlert();
          this.isSubmitted = false;
          return;
        }
        if (this.isEditMode) {
          this.alertService.showConfirmationWithInput({
            text: 'Do you really want to Update?',
          }).then(result => {
            if (result.isConfirmed) {
              const model: ServiceMaster = {
                ...this.formService.transformFormData(this.form.value),
                ReasonToUpdate: result.value
              };
              if (ResultType == 2 && LabelArray.length <= 0) {
                this.alertService.showToast({
                  type: "info",
                  text: "Please Add Atleast one Label Field",
                  timer: 5000
                });
                this.isSubmitted = false;

              }
              else {
                this.updateRecord(model);
              }
            }
            else {
              this.isSubmitted = false;
            }
          });
        }
        else if (ResultType == 2 && LabelArray.length == 0) {
          this.alertService.showToast({
            type: "info",
            text: "Please Add Atleast one Label Field",
            timer: 5000
          });
          this.isSubmitted = false;

        }
        else {
          this.createRecord(this.formService.transformFormData(this.form.value));
        }
      }
      catch (error) {

      }
    }

  createRecord(model: ServiceMaster): void {
    try {
      this.pageService.CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.alertService.showAlert({
              type: "success",
              text: response.Message,
              timer: 5000
            });
            setTimeout(() => {
              this.ngOnInit();
            }, 2000);
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

  updateRecord(model: ServiceMaster): void {
    try {
      this.pageService.UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.alertService.showAlert({
              type: "success",
              text: response.Message,
              timer: 2000
            });
            setTimeout(() => {
              this.router.navigate(['/LB/ServiceMaster/Index']);
            }, 2000);
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

  onClickPageHeaderBackButton(): void {
    this.router.navigate(['/LB/ServiceMaster/Index']);
  }

  resetForm(): void {
    this.alertService.showConfirmation({
      text: 'Are you sure you want to reset the page?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formService.resetFormValue<ServiceMaster>(this.formConfig, this.form);
        this.LabelArray.clear();
      }
    });
  }

  getDetails(): void {
    this.route.params.subscribe((params) => {
      this.ServiceID = +params['id'];
      if (this.ServiceID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(this.ServiceID)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response.IsSuccess) {
                const model = {
                  ...response.Data,
                };
                this.form.patchValue(model);
                this.pageService.GetLabelArray(this.ServiceID)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (arrayResponse) => {
                    if (arrayResponse.IsSuccess) {
                      const model = {
                        ...response.Data,
                        LabelArray: arrayResponse.Data.Items,
                      };
                      model.LabelArray.forEach((item: any) => {
                        const labelGroup = this.formService.createFormGroup(this.formConfig.LabelArray.items) as FormGroup;
                        labelGroup.patchValue(item);
                        this.LabelArray.push(labelGroup);
                      });
                    } else {
                      if (arrayResponse.Message != "Record not found.") {
                        this.alertService.showServerResponseAlert(arrayResponse);
                      }
                    }
                  },
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            },
          });
        } catch (error) {

        }
      }
    });
  }
  get LabelArray(): FormArray {
    return this.form.get('LabelArray') as FormArray;
  }

  getGroup(i: number): FormGroup {
    return this.LabelArray.at(i) as FormGroup;
  }

  //addRow(): void {
  //  const labelArray = this.form.get('LabelArray') as FormArray;
  //  const newLabelGroup = this.formService.createFormGroup(this.formConfig.LabelArray.items) as FormGroup;
  //  labelArray.push(newLabelGroup);
  //}

  addRow(): void {
    const newLabelGroup = this.formService.createFormGroup(this.formConfig.LabelArray.items);
    (this.form.get('LabelArray') as FormArray).push(newLabelGroup);
  }


  deleteRow(i: number): void {
    const Label = this.LabelArray.at(i).get('Label')?.value || "";
    this.alertService.showConfirmation({
      text: `Are you sure you want to delete the Term "<b>${Label}</b>" from the defined Field Option?`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.LabelArray.removeAt(i);
        this.alertService.showToast({
          type: "success",
          text: `Field Label Successfully Deleted.`,
          timer: 5000,
        });
      }
    });
  }

}
