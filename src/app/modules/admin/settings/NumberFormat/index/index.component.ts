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
import { ModuleMasterList } from '../../ModuleMaster/module-master';
import { ModuleMasterService } from '../../ModuleMaster/module-master.service';
import { FormatForList, NumberFormat, NumberFormatList } from '../../NumberFormat/number-format';
import { NumberFormatService } from '../../NumberFormat/number-format.service';
import { SelectList } from '../../SelectList/select-list';
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
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<NumberFormat>;
  tableData: NumberFormatList[] = [];
  ModuleList: ModuleMasterList[] = [];
  CounterList: SelectList[] = [];
  BillingSectionList: SelectList[] = [];
  RestartTypeList: SelectList[] = [];
  FormatForList: FormatForList[] = [];
  IsCreated: boolean = false;
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
    this.loadRestartType('RestartType');
    //this.loadCounter('BillingCounter');
    //this.loadBillingSection('BillingSection');
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
            this.ModuleList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  onModuleChange(): void {
    this.form.get('FormatFor')?.patchValue('');
    this.form.get('BillingSection')?.patchValue(null);
    this.form.get('CounterID')?.patchValue(null);
    const ModuleCode = this.form.get('ModuleCode')?.value;
    if (ModuleCode) {
      this.loadFormatFor(ModuleCode);
      this.tableData = [];
    } else {
      this.tableData = [];
    }
    if (this.CounterList) {
      this.CounterList = [];
    }
    if (ModuleCode === 'PHR') {
      this.getSectionAndCounter('SaleStore');
    }
    else if (ModuleCode === 'PCR') {
      this.loadCounter('PurchaseStore');
    }
    else {
      this.loadCounter('BillingCounter');
    }
    this.loadBillingSection('BillingSection');
    if (!ModuleCode) {
      this.form.get('FormatFor')?.patchValue('');
      this.form.get('BillingSection')?.patchValue(null);
      this.form.get('CounterID')?.patchValue(null);
    }
  }

  loadFormatFor(ModuleCode: string): void {
    const lst: FormatForList[] = [];

    // Clear the current FormatForList
    this.FormatForList = [];

    switch (ModuleCode) {
      case "ADMIN":
        lst.push({ Value: "EmployeeCode", Text: "Emp Code" });
        break;
      case "BMS":
        lst.push({ Value: "ServiceInvoiceNo", Text: "Bill Number" });
        lst.push({ Value: "CreditNoteNo", Text: "Credit Note Number" });
        lst.push({ Value: "ReceiptVoucherNo", Text: "Receipt Voucher Number" });
        lst.push({ Value: "RefundVoucherNo", Text: "Refund Voucher Number" });
        break;
      case "HR":
        lst.push({ Value: "EmployeeLoanNo", Text: "Employee Loan No." });
        break;
      case "IMS":
        lst.push({ Value: "ConsumptionNoteNo", Text: "Consumption No." });
        lst.push({ Value: "DisposalNoteNo", Text: "Disposal No." });
        lst.push({ Value: "IndentNoteNo", Text: "Indent No." });
        lst.push({ Value: "IssueNoteNo", Text: "Issue No." });
        lst.push({ Value: "OutwardNoteNo", Text: "Outward No." });
        lst.push({ Value: "ReturnNoteNo", Text: "Return No." });
        lst.push({ Value: "StockAdjustmentNo", Text: "Stock Adjustment No." });
        lst.push({ Value: "StockEntryNo", Text: "Stock Entry No." });
        lst.push({ Value: "TransferNoteNo", Text: "Transfer No." });
        break;
      case "IPC":
        lst.push({ Value: "InsuranceCaseNo", Text: "Insurance Case Number" });
        lst.push({ Value: "SettlementReceiptNo", Text: "Settlement Receipt Number" });
        break;
      case "LB":
        lst.push({ Value: "BookingNo", Text: "Booking Number" });
        lst.push({ Value: "CollectionNo", Text: "Sample Collection Number" });
        lst.push({ Value: "ReportNo", Text: "Report Number" });
        break;
      case "MRD":
        lst.push({ Value: "IPCertificate", Text: "IP Certificate Number" });
        lst.push({ Value: "OPCertificate", Text: "OP Certificate Number" });
        lst.push({ Value: "ThalassemiaCertificate", Text: "Thalassemia Certificate Number" });
        break;
      case "NS":
        lst.push({ Value: "PharmaIndentNo", Text: "Indent No." });
        break;
      case "OT":
        lst.push({ Value: "ScheduleNo", Text: "OT Schedule No" });
        lst.push({ Value: "SurgeryNo", Text: "OT Surgery No" });
        break;
      case "PCR":
        lst.push({ Value: "PurOrderNo", Text: "PO No." });
        lst.push({ Value: "POAmendmentNo", Text: "POA No." });
        lst.push({ Value: "PurChallanNo", Text: "Purchase Challan No." });
        lst.push({ Value: "PurInvoiceNo", Text: "Purchase Invoice No." });
        lst.push({ Value: "PurReturnNo", Text: "Purchase Return No." });
        lst.push({ Value: "CreditNoteNo", Text: "Credit Note No." });
        lst.push({ Value: "PaymentVoucherNo", Text: "Payment Voucher No." });
        break;
      case "PHR":
        lst.push({ Value: "SalesInvoiceNo", Text: "Sales Bill Number" });
        lst.push({ Value: "SalesReturnNo", Text: "Sales Return Number" });
        lst.push({ Value: "ReceiptVoucherNo", Text: "Receipt Voucher Number" });
        lst.push({ Value: "RefundVoucherNo", Text: "Refund Voucher Number" });
        break;
      case "PMS":
        lst.push({ Value: "AppointmentNo", Text: "Appointment Number" });
        lst.push({ Value: "PRNO", Text: "Patient Registration Number" });
        lst.push({ Value: "OPNO", Text: "Out-Patient Number" });
        lst.push({ Value: "IPNO", Text: "In-Patient Number" });
        lst.push({ Value: "BirthEntryNo", Text: "Birth Entry Number" });
        lst.push({ Value: "DeathEntryNo", Text: "Death Entry Number" });
        lst.push({ Value: "MLCEntryNo", Text: "MLC Entry Number" });
        break;
      case "PR":
        lst.push({ Value: "LeaveRequestNo", Text: "Leave Request No." });
        lst.push({ Value: "SalarySlipNo", Text: "Salary Slip No." });
        break;
      case "RD":
        lst.push({ Value: "BookingNo", Text: "Booking Number" });
        lst.push({ Value: "ReportNo", Text: "Report Number" });
        break;
      default:
        break;
    }
    this.FormatForList.push(...lst);
  }

  onFormatForChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    const FormatFor = this.form.get('FormatFor')?.value;
    const BillingSection = this.form.get('BillingSection')?.value;
    const CounterID = this.form.get('CounterID')?.value;
    if (FormatFor && (ModuleCode !== 'BMS' && ModuleCode !== 'PHR')) {
      this.loadData(FormatFor, ModuleCode, BillingSection, CounterID);
    } else {
      this.tableData = [];
    }
    this.form.get('BillingSection')?.patchValue(null);
    this.form.get('CounterID')?.patchValue(null);
  }

  onCounterChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    const FormatFor = this.form.get('FormatFor')?.value;
    const BillingSection = this.form.get('BillingSection')?.value;
    const CounterID = this.form.get('CounterID')?.value;
    if (ModuleCode === 'BMS' || ModuleCode === 'PHR' && FormatFor) {
      if (CounterID > 0) {
        this.loadData(FormatFor, ModuleCode, BillingSection, CounterID);
      }
    }
    else {
      this.tableData = [];
    }
    if (!CounterID) {
      this.tableData = [];
    }
  }

  onBillingSectionChange(): void {
    const ModuleCode = this.form.get('ModuleCode')?.value;
    const FormatFor = this.form.get('FormatFor')?.value;
    const BillingSection = this.form.get('BillingSection')?.value;
    const CounterID = this.form.get('CounterID')?.value;
    if (ModuleCode === 'BMS' || ModuleCode === 'PHR' && FormatFor) {
      if (BillingSection > 0) {
        this.loadData(FormatFor, ModuleCode, BillingSection, CounterID);
      }
    }
    else {
      this.tableData = [];
    }
    if (!BillingSection) {
      this.tableData = [];
    }
  }

  loadRestartType(FieldName: string) {
    try {
      this.commonSelectService.PopulateList('Admin', 'NumberFormat', FieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.RestartTypeList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  loadCounter(FieldName: string) {
    try {
      this.commonSelectService.PopulateList('Admin', 'NumberFormat', FieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.CounterList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  loadBillingSection(FieldName: string) {
    try {
      this.commonSelectService.PopulateList('Admin', 'NumberFormat', FieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.BillingSectionList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  getSectionAndCounter(FieldName: string) {
    try {
      this.commonSelectService.PopulateList('Admin', 'NumberFormat', FieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.CounterList = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert({
              Status: response.Status,
              Message: response.Message,
              ValidationErrors: response.ValidationErrors,
            });
          }
        },
      });
    } catch (error) {

    }
  }

  loadData(FormatFor: string, ModuleCode: string, BillingSection: string, CounterID: number) {
    try {
      this.pageService.GetDetails(FormatFor, ModuleCode, BillingSection, CounterID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.tableData = response.Data.Items;
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
            this.resetForm();
            this.loadData(model.FormatFor as string, model.ModuleCode as string, model.BillingSection as string, model.CounterID as number);
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
