import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { BillCompanyMasterList } from '../../BillCompanyMaster/bill-company-master';
import { BillCompanyMasterService } from '../../BillCompanyMaster/bill-company-master.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { PlanMaster, PlanMaster_BillTypeMappingList, PlanMaster_SelectList } from '../plan-master';
import { PlanMasterService } from '../plan-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<PlanMaster>;
  PlanTypeList: SelectList[] = [];
  PlanList: PlanMaster_SelectList[] = [];
  IPBillingAllowedBasedOnList: SelectList[] = [];
  OPReturnAllowedBasedOnList: SelectList[] = [];
  IPReturnAllowedBasedOnList: SelectList[] = [];
  DefaultBillTypeList: SelectList[] = [];
  IsAllowedCreditBillForOPList: SelectList[] = [];
  IsAllowedCreditBillForIPList: SelectList[] = [];
  BillCompanyList: BillCompanyMasterList[] = [];
  PlanMasterBillTypeMappingList: PlanMaster_BillTypeMappingList[] = [];
  PlanID: number | null = null;

  constructor(
    private pageService: PlanMasterService,
    private billCompanyService: BillCompanyMasterService,
    private selectListService: SelectListService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<PlanMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    this.loadMappingList(null);
    this.loadPlan();
    this.loadBillCompany();
    this.loadSelectListData('PlanType', 'PlanTypeList');
    this.loadSelectListData('IPBillingAllowedBasedOn', 'IPBillingAllowedBasedOnList');
    this.loadSelectListData('OPReturnAllowedBasedOn', 'OPReturnAllowedBasedOnList');
    this.loadSelectListData('IPReturnAllowedBasedOn', 'IPReturnAllowedBasedOnList');
    this.loadSelectListData('BillType', 'DefaultBillTypeList');
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    try {
      this.router.navigate(['/Admin/PlanMaster/Index']);
    }
    catch (error) {

    }
  }

  get PlanMasterBillTypeMappingArray(): FormArray<FormGroup> {
    return this.form.get('BillTypeMapping') as FormArray<FormGroup>;
  }

  loadSelectListData(FieldName: string, targetList: keyof CreateComponent) {
    try {
      this.selectListService.PopulateList('Admin', 'PlanMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              (this[targetList] as SelectList[]) = response.Data.Items;
            } else {
              this.alertService.showServerResponseToast(response);
            }
          }
        });
    }
    catch (error) {

    }
  }

  loadBillCompany(): void {
    try {
      this.billCompanyService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.BillCompanyList = response.Data.Items;
            } else {
              this.alertService.showServerResponseToast(response);
            }
          },
        });
    }
    catch (error) {

    }
  }

  loadPlan(): void {
    try {
      this.pageService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.PlanList = response.Data.Items;
            } else {
              this.alertService.showServerResponseToast(response);
            }
          }
        });
    }
    catch (error) {

    }
  }

  loadMappingList(PlanID: number | null) {
    try {
      this.pageService.GetDetailsBillTypeMapping(PlanID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.PlanMasterBillTypeMappingList = response.Data.Items;
              this.PlanMasterBillTypeMappingList.forEach((mapping) => {
                this.PlanMasterBillTypeMappingArray.push(this.formService.createFormArrayItem(this.formConfig.BillTypeMapping.items));
              })
              this.PlanMasterBillTypeMappingArray.patchValue(this.PlanMasterBillTypeMappingList = response.Data.Items)
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    }
    catch (error) {

    }
  }

  onChange_IsCopyRate(event: any): void {
    const IsCopyRate = this.form.get('IsCopyRate')?.value;
    if (!IsCopyRate) {
      this.form.get('CopyRateID')?.setValue(null);
      this.form.get('CopyRateID')?.disable();
    }
    else{
      this.form.get('CopyRateID')?.enable();
    }
  }

  resetForm(): void{
    this.formService.resetFormValue<PlanMaster>(this.formConfig, this.form);
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
            const model: PlanMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(model);
          }
          else {
            this.isSubmitted = false;
          }
        });
      }
      else {
        this.createRecord(this.formService.transformFormData(this.form.value));
      }
    }
    catch (error) {

    }
  }

  createRecord(model: PlanMaster): void {
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

  updateRecord(model: PlanMaster): void {
    try {
      this.pageService.UpdateRecord(model)
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
                this.router.navigate(['/Admin/PlanMaster/Index']);
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

  getDetails(): void {
    this.route.params.subscribe((params) => {
      this.PlanID = +params['id'];
      if (this.PlanID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(this.PlanID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  // Get the Mapping List Data
                  this.pageService.GetDetailsBillTypeMapping(this.PlanID)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                      next: (detailResponse) => {
                        if (detailResponse.IsSuccess) {
                          const model = {
                            ...response.Data,
                            BillTypeMapping: detailResponse.Data.Items,
                          };
                          this.form.patchValue(model);
                        }
                        else {
                          this.alertService.showServerResponseAlert(detailResponse);
                        }
                      },
                    });
                }
                else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
        catch (error) {
        }
      }
    });
  }
}