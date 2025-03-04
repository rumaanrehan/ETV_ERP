import { IMS_CategoryMasterService } from './../IMS_CatergoryMasterService';
import { CategoryMaster, CategoryType } from './../CategoryMaster';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormSidebarComponent } from '../../../shared/components/form-sidebar/form-sidebar.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ZFormControlsModule } from '../../../shared/components/z-form-controls/z-form-controls.module';
import { FormService } from '../../../shared/services/form.service';
import { Subject, takeUntil } from 'rxjs';
import { SelectListService } from '../../../shared/services/select-list.service';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { FormConfigType } from '../../../shared/models/form.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'myapp-create',
  standalone: true,
  imports: [
    FormSidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    ZFormControlsModule,
  ],
  providers: [FormService, DatePipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<CategoryMaster>;
  Id!: number;
  details?: any;
  CategoryList: CategoryType[] = [];
  defaultCategoryTypeID: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componentService: IMS_CategoryMasterService,
    private selectListService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.loadCategory();
    this.formConfig = this.componentService.getFormConfig();
    this.form = this.formService.createFormGroup<CategoryMaster>(
      this.formConfig
    );
    this.formService.initializeFormValidationMessage(
      this.formConfig,
      this.form
    );

    this.getId();
    if (this.Id) {
      this.getDetails();
      this.isEditMode = true;
    }
  }

  getId() {
    this.route.params.subscribe((params: any) => {
      console.log(params.id);
      if (params.id) {
        this.Id = params.id;
      }
    });
  }

  loadCategory(): void {
    try {
      this.componentService.CategoryTypePopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.CategoryList = response.Data.Items;
            this.defaultCategoryTypeID =
              this.CategoryList.find((Category) => true)?.CategoryTypeID ??
              this.CategoryList[0].CategoryTypeID;
            this.form
              .get('CategoryTypeID')
              ?.setValue(this.defaultCategoryTypeID);
          } else {
            this.CategoryList = [];
          }
        },
      });
    } catch (error) {}
  }

  getDetails() {
    this.componentService
      .GetDetails(this.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          if (response.IsSuccess) {
            this.details = response.Data;
            this.patchValues();
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
  }

  patchValues() {
    this.form.patchValue({
      CategoryID: this.details.CategoryID,
      CategoryCode: this.details.CategoryCode,
      CategoryName: this.details.CategoryName,
      CategoryTypeID: this.details.CategoryTypeID
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(
    ActiveStatus: boolean,
    isEditMode: boolean,
    model: CategoryMaster
  ): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }
    if (!isEditMode) {
      model.CategoryID = this.defaultCategoryTypeID;
    }
    this.form.patchValue({
      ...model,
      CountryID: model.CategoryID,
    });
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.router.navigate([`/IMS/CategoryMaster/Index`]);
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<CategoryMaster>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    console.log('on submit clicked...')

    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.formService.validateFormFields(this.formConfig, this.form);
    //   this.alertService.showValidationAlert();
    //   this.isSubmitted = false;
    //   return;
    // }

    console.log('clicked');
    // console.log('Form data:', this.form.value);
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (this.isEditMode) {
      this.alertService
        .showConfirmationWithInput({ text: 'Do you really want to Update?' })
        .then((result) => {
          if (result.isConfirmed) {
            const model: CategoryMaster = {
              ...this.formService.transformFormData(this.form.value),
              // CreatedByDateTime: currentDate,
              // ModifiedDateTime: currentDate,
              ReasonToUpdate: result.value,
            };
            console.log('clicked..')
            this.updateRecord(model);
          } else {
            this.isSubmitted = false;
          }
        });
    } else {
      console.log('in create condition');
      const categoryData: CategoryMaster = {
        ...this.formService.transformFormData(this.form.value),
        ActiveStatus: true,
        // CreatedDateTime: currentDate,
        // ModifiedDateTime: currentDate,
        // CreatedBy: 'admin',
        // ModifiedBy: 'admin',
        // CategoryCode: '10001',
      };
      // const categoryData = this.formService.transformFormData(this.form.value)
      // console.log('Sending to backend:', categoryData);
      this.createRecord(categoryData);
    }
  }

  createRecord(model: CategoryMaster): void {
    model.CategoryCode = `C0000${this.Id}`
    console.log(model);
    this.componentService
      .CreateCategory(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.IsSuccess) {
          this.closeSidebar();
          this.alertService.showAlert({
            type: 'success',
            text: response.Message,
            timer: 5000,
          });
        } else {
          console.log(model);
          this.alertService.showServerResponseAlert(response);
        }
        this.isSubmitted = false;
      });
  }

  updateRecord(model: CategoryMaster): void {
    model.CategoryID = this.Id;
    model.ActiveStatus = true;
    console.log(model.CategoryID)
    console.log('mymodel  ', model);
    this.componentService
      .UpdateCategory(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.IsSuccess) {
          console.log('closing')
          // this.router.navigate(['/IMS/CategoryMaster/Index']);
          this.closeSidebar();
          this.alertService.showAlert({
            type: 'success',
            text: response.Message,
            timer: 5000,
          });
        } else {
          this.alertService.showServerResponseAlert(response);
        }
        this.isSubmitted = false;
      });
  }

  resetForm(): void {
    this.formService.resetFormValue<CategoryMaster>(this.formConfig, this.form);
  }
}
