import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { SelectListRequest } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { ModuleMaster_SelectList } from '../../module-master/module-master';
import { NumberFormat, NumberFormatList, NumberFormatRequest } from '../number-format';
import { NumberFormatService } from '../number-format.service';

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

  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('effectiveFromTemplate', { static: true }) effectiveFromTemplate!: TemplateRef<any>;
  @ViewChild('termEndDateTemplate', { static: true }) termEndDateTemplate!: TemplateRef<any>;
  @ViewChild('prefillZeroTemplate', { static: true }) prefillZeroTemplate!: TemplateRef<any>;
  @ViewChild('restartTypeTemplate', { static: true }) restartTypeTemplate!: TemplateRef<any>;
  @ViewChild('createdDateTemplate', { static: true }) createdDateTemplate!: TemplateRef<any>;

  isCreated: boolean = false;
  isSubmitted: boolean = false;
  
  tableDef!: TableDef<NumberFormatList>;

  moduleList: ModuleMaster_SelectList[] = [];
  formatForList: StaticList[] = [];
  restartTypeList: StaticList[] = [];

  form!: FormGroup;
  formConfig!: FormConfigType<NumberFormat>;

  constructor(
    private pageService: NumberFormatService,
    private commonSelectService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<NumberFormat>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    this.tableDef = {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "4%", customTemplate: this.serialNoColTemplate },
        { data: "SampleNumberFormat", hideVisToggle: true, label: "Sample Number", width: "12%" },
        { data: "EffectiveFromDate", hideVisToggle: true, label: "Effective From", width: "10%", customTemplate: this.effectiveFromTemplate },
        { data: "TermEndDate", hideVisToggle: true, label: "Term End Date", width: "10%", customTemplate: this.termEndDateTemplate },
        { data: "StartNumber", hideVisToggle: true, label: "Start Number", width: "8%" },
        { data: "WidthOfNumberPart", hideVisToggle: true, label: "Width of Number", width: "10%" },
        { data: "PrefillZero", label: "Prefill Zero", width: "8%", customTemplate: this.prefillZeroTemplate },
        { data: "PrefixFront", label: "Prefix Front", width: "8%"},
        { data: "PrefixRear", label: "Prefix Rear", width: "8%"},
        { data: "Suffix", label: "Suffix", width: "5%"},
        { data: "RestartType", label: "Restart By", width: "8%", customTemplate: this.restartTypeTemplate },
        { data: "CreatedDateTime", label: "Added Time", width: "12%", customTemplate: this.createdDateTemplate }
      ],
      data: []
    }

    this.loadDropdownList();
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'RestartType', targetList: 'restartTypeList' },
    ]);
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data.moduleList.Data.Items);
          this.moduleList = data.moduleList.Data.Items;
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof IndexComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};
    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'Admin',
        ControllerName: 'NumberFormat',
        FieldName: fieldName,
      });
    });

    forkJoin(sources)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        listConfigs.forEach(({ targetList }) => {
          if (response[targetList]?.IsSuccess) {
            (this[targetList] as StaticList[]) = response[targetList].Data.Items || [];
          } else {
            (this[targetList] as StaticList[]) = [];
          }
        });
      },
    });
  }

  onModuleChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    if (ModuleCode) {
      this.loadFormatFor(ModuleCode);
      this.tableDef.data = [];
    } else {
      this.tableDef.data = [];
    }
  }

  loadFormatFor(moduleCode: string): void {
    const model: SelectListRequest = {
      AreaName: moduleCode,
      ControllerName: 'NumberFormat',
      FieldName: 'FormatFor',
      PopulateType: 'SelectList'
    };  
    this.commonSelectService.PopulateList(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
      this.formatForList = response.Data.Items;
    });
  }

  loadNumberFormats(): void {
    const model: NumberFormatRequest = {
      ModuleCode: this.form.get('ModuleCode')?.value ?? null,
      FormatFor: this.form.get('FormatFor')?.value ?? null,
      PopulateType: 'SelectList'
    };   
    try {
      this.pageService.GetDetails(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableDef.data = response.Data.Items;
          }
          else {
            this.tableDef.data = [];
            this.alertService.showServerResponseAlert(response);
          }
        }
      });
    }
    catch (error) {
      this.tableDef.data = [];
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
            this.isCreated = response.IsSuccess
            this.alertService.showToast({
                type: "success",
                text: response.Message,

                timer: 5000
            });
            this.loadNumberFormats();
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
    if (this.isCreated) {
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
          this.tableDef.data = [];
        }
      });
    }
  }
}