import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ShowValidationTooltipDirective } from '../../../../../shared/layouts/directives/show-validation-tooltip.directive';
import { FormErrors, FormValidationMessages } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { HolidayMaster } from '../../HolidayMaster/holiday-master';
import { HolidayMasterService } from '../../HolidayMaster/holiday-master.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { NotOnlyWhitespaceValidator } from '../../../../../shared/validators/not-only-whitespace.validator';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PickList } from 'primeng/picklist';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ShowValidationTooltipDirective, CommonModule, CalendarModule, FloatLabelModule, DropdownModule, InputTextModule, InputTextareaModule, ZFormControlsModule, InputNumberModule, InputSwitchModule, CheckboxModule, RadioButtonModule,],
  providers: [FormService, DatePipe],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  // private model: HolidayMaster = new HolidayMaster();
  public mainForm!: FormGroup;
  public formValidationMessages: FormValidationMessages = {};
  public formErrors: FormErrors = {};
  HolidayTypeList: SelectList[] = [];
  selectedHolidayTypes: SelectList[] = [];

  categories: any[] = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' }
  ];

  constructor(
    private holidayService: HolidayMasterService,
    private commonSelectService: SelectListService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formErrors = {
      HolidayID: '',
      HolidayName: '',
      HolidayTypeID: '',
      HolidayDate: '',
      HolidayDescriptions: '',
      InputNumber: '',
      selectedCategory: '',
      PickList: '',
    };

    this.formValidationMessages = {
      HolidayID: {
        required: 'Holiday ID is Required.',
      },
      HolidayName: {
        required: 'Holiday Name is Required.',
        //whitespace: 'Value can not be empty.',
        maxlength: 'Holiday Name cannot be longer than 50 characters.'
      },
      HolidayTypeID: {
        required: 'Holiday Type is Required.',
      },
      HolidayDate: {
        required: 'Holiday Date is Required.',
      },
      HolidayDescriptions: {
        required: 'Holiday Description is Required.',
      },
      InputNumber: {
        required: 'Input Number is Required.',
      },
      selectedCategory: {
        required: 'Radio is Required.',
      },
      PickList: {
        required: 'Pick List is Required.',
      },
    };

    // this.mainForm = this.createFormFromModel(this.model);
    this.formService.setValidationMessages(this.formValidationMessages, this.formErrors, this.mainForm);
    this.loadHolidayType('Admin', 'HolidayMaster', 'HolidayType');
  }

  loadHolidayType(ModuleName: string, PageName: string, FieldName: string) {
    this.commonSelectService.PopulateList(ModuleName, PageName, FieldName).subscribe({
      next: (response) => {
        if (response.IsSuccess) {
          this.HolidayTypeList = response.Data.Items;
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createFormFromModel(model: HolidayMaster): FormGroup {
    return this.formBuilder.group({
      HolidayID: [model.HolidayID, this.isEditMode ? [Validators.required] : []],
      HolidayCode: [model.HolidayCode || 'NEW'],
      HolidayName: [model.HolidayName || '', [Validators.required, NotOnlyWhitespaceValidator(), Validators.maxLength(50)]],
      HolidayDescriptions: [model.HolidayDescriptions || '', [Validators.required]],
      HolidayTypeID: [model.HolidayTypeID?.toString() || '', [Validators.required]],
      HolidayDate: [DateUtils.toDate(model.HolidayDate), [Validators.required]],
      selectedCategory: ['', [Validators.required]],
      checkbox: [false, [Validators.required]],
      Switch: [false, [Validators.required]],
      InputNumber: [null, [Validators.required]],
      PickList: [null, [Validators.required]],
    });
  }

  // openSidebar(isEditMode: boolean, model: HolidayMaster = this.model): void {
  //   this.model = model;
  //   this.isEditMode = isEditMode;
  //   this.mainForm = this.createFormFromModel(this.model);
  //   this.formService.setValidationMessages(this.formValidationMessages, this.formErrors, this.mainForm);
  //   this.isFormSidebarVisible = true;
  // }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.resetForm();

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }


  onSubmit(): void {
    if (this.mainForm.invalid) {
      this.mainForm.controls['selectedCategory'].markAsDirty();
      this.mainForm.markAllAsTouched();
      this.formService.validateForm(this.formValidationMessages, this.formErrors, this.mainForm);
      this.alertService.showValidationToast(this.formErrors);
      (document.querySelector('input.ng-invalid, textarea.ng-invalid, select.ng-invalid') as HTMLElement)?.focus();
    } else {
      if (this.isEditMode) {
        // this.alertService.showConfirmationWithInput({
        //   text: 'Do you really want to Update?',
        // }).then(result => {
        //   if (result.isConfirmed) {
        //     this.model = this.formService.processFormData(this.mainForm.value);
        //     this.model.ReasonToUpdate = result.value;
        //     this.updateRecord(this.model);
        //   }
        // });
      } else {
        // this.model = this.formService.processFormData(this.mainForm.value);
        // this.createRecord(this.model);
      }
    }
  }

  createRecord(model: HolidayMaster): void {
    this.holidayService.CreateRecord(model)
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
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        }
      });
  }

  updateRecord(model: HolidayMaster): void {
    this.holidayService.UpdateRecord(model)
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
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors
            });
          }
        },
      });
  }

  resetForm(): void {
    this.mainForm.reset();
    // this.model = this.mainForm.value;
  }
}
