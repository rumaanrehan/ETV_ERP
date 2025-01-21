import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';
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
import { ServiceMasterList } from '../../../../RD/Settings/ServiceMaster/service-master';
import { ServiceMasterService } from '../../../../RD/Settings/ServiceMaster/service-master.service';
import { ReportTemplateMaster } from '../report-template';
import { ReportTemplateService } from '../report-template.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, EditorModule],
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
  formConfig!: FormConfigType<ReportTemplateMaster>;

  CategoryList: ServiceCategoryMasterList[] = [];
  TestTypeList: ServiceMasterList[] = [];
  ResultTypeList: SelectList[] = [];

  ReportTemplateID: number | null = null; // For Edit Mode


  constructor(
    private pageService: ReportTemplateService,
    private pageHeaderService: PageHeaderService,
    private serviceCategoryMasterService: ServiceCategoryMasterService,
    private selectListservice: SelectListService,
    private serviceMasterservice: ServiceMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ReportTemplateMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadServiceCategory();
    //this.loadTestService('TestType');
    //this.loadResultType('ResultType');
    this.getDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServiceCategory() {
    try {
      this.serviceCategoryMasterService.PopulateList('RD', 'SelectList')
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

  onServiceCategoryChange(): void {
    const ServiceCategoryID = this.form.get('ServiceCategoryID')?.value;
    if (ServiceCategoryID) {
      this.loadTestService(ServiceCategoryID);
    }
  }

  loadTestService(ServiceCategoryID: number) {
    try {
      this.serviceMasterservice.PopulateList(ServiceCategoryID, 'ServiceCategoryWise')
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
      this.selectListservice.PopulateList('LB', 'ReportTemplateMaster', FieldName)
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
            const model: ReportTemplateMaster = {
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

  createRecord(model: ReportTemplateMaster): void {
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

  updateRecord(model: ReportTemplateMaster): void {
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
                this.router.navigate(['/LB/ReportTemplateMaster/Index']);
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
    this.router.navigate(['/LB/ReportTemplateMaster/Index']);
  }

  resetForm(): void {
    this.alertService.showConfirmation({
      text: 'Are you sure you want to reset the page?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formService.resetFormValue<ReportTemplateMaster>(this.formConfig, this.form);
      }
    });
  }

  getDetails(): void {
    this.route.params.subscribe((params) => {
      this.ReportTemplateID = +params['id'];
      if (this.ReportTemplateID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(this.ReportTemplateID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  const model = {
                    ...response.Data,
                  };
                  const ServiceCategoryID =response.Data.ServiceCategoryID ;
                  this.loadTestService(ServiceCategoryID);
                  this.form.patchValue(model);
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
