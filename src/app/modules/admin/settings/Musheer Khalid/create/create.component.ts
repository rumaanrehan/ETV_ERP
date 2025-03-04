import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { MusheerKhalid } from '../musheer-khalid';
import { MusheerKhalidService } from '../musheer-khalid.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    FormSidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    ZFormControlsModule,
  ],
  providers: [FormService, DatePipe],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<MusheerKhalid>;
  HolidayTypeList: SelectList[] = [];

  categories: any[] = [
    { name: 'Accounting', key: 'A' },
    { name: 'Marketing', key: 'M' },
    { name: 'Production', key: 'P' },
    { name: 'Research', key: 'R' },
  ];

  constructor(
    private componentService: MusheerKhalidService,
    private selectListService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.componentService.getFormConfig();
    this.form = this.formService.createFormGroup<MusheerKhalid>(
      this.formConfig
    );
    this.formService.initializeFormValidationMessage(
      this.formConfig,
      this.form
    );
    this.loadHolidayType('Admin', 'HolidayMaster', 'HolidayType');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHolidayType(ModuleName: string, PageName: string, FieldName: string) {
    try {
      this.selectListService
        .PopulateList(ModuleName, PageName, FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.HolidayTypeList = response.Data.Items;
            }
          },
        });
    } catch (error) {}
  }

  openSidebar(isEditMode: boolean, model: MusheerKhalid): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      // this.form.get('HolidayID')?.setValidators([Validators.required]);
    }
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<MusheerKhalid>(this.formConfig, this.form);

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
        this.alertService
          .showConfirmationWithInput({
            text: 'Do you really want to Update?',
          })
          .then((result) => {
            if (result.isConfirmed) {
              const model: MusheerKhalid = {
                ...this.formService.transformFormData(this.form.value),
                ReasonToUpdate: result.value,
              };
              this.updateRecord(model);
            } else {
              this.isSubmitted = false;
            }
          });
      } else {
        this.createRecord(this.formService.transformFormData(this.form.value));
      }
    } catch (error) {}
  }

  createRecord(model: MusheerKhalid): void {
    try {
      this.componentService
        .CreateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeSidebar();
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000,
              });
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          },
        });
    } catch (error) {}
  }

  updateRecord(model: MusheerKhalid): void {
    try {
      this.componentService
        .UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeSidebar();
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000,
              });
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          },
        });
    } catch (error) {}
  }
}
