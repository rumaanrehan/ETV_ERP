import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { ModuleMaster_SelectList } from '../../ModuleMaster/module-master';
import { ModuleMasterService } from '../../ModuleMaster/module-master.service';
import { FormatForList, NumberFormat, NumberFormatList } from '../../NumberFormat/number-format';
import { NumberFormatService } from '../../NumberFormat/number-format.service';
import { SelectList, SelectListRequest } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [TableModule,ReactiveFormsModule,CommonModule,ZFormControlsModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  IsCreated: boolean = false;
  isSubmitted: boolean = false;

  tableData: NumberFormatList[] = [];

  moduleList: ModuleMaster_SelectList[] = [];
  formatForList: FormatForList[] = [];
  restartTypeList: SelectList[] = [];

  form!: FormGroup;
  formConfig!: FormConfigType<NumberFormat>;

  constructor(
    private pageService: NumberFormatService,
    private moduleService: ModuleMasterService,
    private commonSelectService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<NumberFormat>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadModule();
    this.loadRestartType();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadModule(): void {
    try {
      this.moduleService.PopulateList('SelectList')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.moduleList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  loadRestartType(): void {
    this.commonSelectService.PopulateList({AreaName: 'Admin', ControllerName: 'NumberFormat', FieldName: 'RestartType', PopulateType: 'SelectList'} as SelectListRequest)
      .subscribe(response => {
        console.log(response.Data.Items)
      this.restartTypeList = response.Data.Items; 
    });
  }

  onModuleChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    if (ModuleCode) {
      this.loadFormatFor(ModuleCode);
      this.tableData = [];
    } else {
      this.tableData = [];
    }
  }

 loadFormatFor(ModuleCode: string): void {
    this.commonSelectService.PopulateList({AreaName: ModuleCode, ControllerName: 'NumberFormat', FieldName: 'FormatFor', PopulateType: 'SelectList'} as SelectListRequest)
      .subscribe(response => {
        console.log(response.Data.Items)
      this.formatForList = response.Data.Items; 
    });
  }

  onFormatForChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    const FormatFor = this.form.get('FormatFor')?.value;
      this.loadData({ ModuleCode: ModuleCode, FormatFor: FormatFor, PopulateType: "SelectList"} as NumberFormat);
  }

  loadData(model: NumberFormat) {
    try {
      this.pageService.GetDetails(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableData = response.Data.Items;
          }
          else {
            this.tableData = [];
            this.alertService.showServerResponseAlert(response);
          }
        }
      });
    }
    catch (error) {

    }
  }

  onSubmit(): void {
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
       this.createRecord(this.formService.transformFormData(this.form.value));
    }
    catch (error) {

    }
  }

  createRecord(model: NumberFormat): void {
    try {
      this.pageService.CreateRecord(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.IsCreated = response.IsSuccess
            this.alertService.showToast({
                type: "success",
                text: response.Message,

                timer: 5000
            });
            const ModuleCode = this.form.get('ModuleCode')?.value;
            const FormatFor = this.form.get('FormatFor')?.value;
            this.loadData({ModuleCode: ModuleCode, FormatFor: FormatFor, PopulateType: "SelectList"} as  NumberFormat);
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

  resetForm(): void {
    if (this.IsCreated) {
      this.form.reset({
        StartNumber: null,
        WidthOfNumberPart: null,
        PrefillZero: false,
        PrefixFront: null,
        PrefixRear: null,
        Suffix: null,
        EffectiveFromDate: null,
        RestartType: 1,
      });
    } else {
      this.alertService.showConfirmation({
        text: 'Are you sure you want to reset the page?',
      }).then((result) => {
        if (result.isConfirmed) {
          this.formService.resetFormValue<NumberFormat>(this.formConfig, this.form);
          this.tableData = [];
        }
      });
    }
  }
}