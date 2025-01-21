import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SelectList } from '../../../../admin/settings/SelectList/select-list';
import { SelectListService } from '../../../../admin/settings/SelectList/select-list.service';
import { LoanTypeMasterList } from '../../../Settings/LoanTypeMaster/loan-type-master';
import { LoanTypeMasterService } from '../../../Settings/LoanTypeMaster/loan-type-master.service';
import { EmployeeLoan } from '../employee-loan';
import { EmployeeLoanService } from '../employee-loan.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, CommonModule, ReactiveFormsModule, ZFormControlsModule, FieldsetModule, TableModule, FormsModule, AutoCompleteModule],
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
  formConfig!: FormConfigType<EmployeeLoan>;
  LoanTypeList: LoanTypeMasterList[] = [];
  InterestRateList: LoanTypeMasterList[] = [];
  PaymentModeList: SelectList[] = [];
  StatusList: SelectList[] = [];
  SearchBylist: SelectList[] = [];
  filteredItems: any[] = [];
  EmployeeList: any[] = [];
  selectedItem: any = null;
  isUpdateDisabled: boolean = false;
  data: any[] = [];
  SearchBy!: number;
  searchValue!: string | number;
  EmployeeLoanID!: number;
  selectedLoanType!: number;
  InterestRate!: number;
  EmployeeLoanNo!: number;
  defaultDate: Date = new Date;
  EmployeeID!: any;
  constructor(
    private pageService: EmployeeLoanService,
    private pageHeaderService: PageHeaderService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private loanTypeService: LoanTypeMasterService,
    private employeeLoanService: EmployeeLoanService,
    private selectListService: SelectListService,
    private SearchByService: SelectListService,
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<EmployeeLoan>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.form.get('dtEmployeeLoanDate')?.setValue(this.defaultDate);
    this.form.get('EmployeeLoanNo')?.setValue(this.EmployeeLoanNo);
    this.loadRepaymentMode('RepaymentMode');
    this.loadSearchBy('SearchBy');
    this.loadStatus(this.isEditMode ? 'StatusForEdit' : 'StatusForCreate');
    this.getDetails();
    this.loadLoanType();
  }

  onSearchChange(): void {
    this.SearchBy = this.form.get('SearchBy')?.value;
  }

  filterEmployee(event: AutoCompleteCompleteEvent): void {
    this.SearchBy = this.form.get('SearchBy')?.value;
    this.searchValue = event.query;
    if (this.SearchBy && this.searchValue) {
      this.loadData();
    }
  }

  loadData(): void {
    try {
      this.employeeLoanService.PopulateList(this.SearchBy, this.searchValue).subscribe({
        next: (response) => {
          if (response?.IsSuccess && Array.isArray(response?.Data?.Items)) {
            this.EmployeeList = response.Data.Items;
            this.filteredItems = this.EmployeeList;
          } else {
            this.EmployeeList = [];
            this.filteredItems = [];
          }
        },
      });
    } catch (error) {

    }
  }

  loadSearchBy(FieldName: string) {
    try {
      this.SearchByService.PopulateList('HR', 'EmployeeLoan', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.SearchBylist = response.Data.Items;
            }
            console.log(this.SearchBylist);
          },
        });
    }
    catch (error) {

    }
  }


  loadRepaymentMode(FieldName: string) {
    try {
      this.selectListService.PopulateList('HR', 'EmployeeLoan', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.PaymentModeList = response.Data.Items;
            }
            console.log(this.PaymentModeList);
          },
        });
    }
    catch (error) {

    }
  }

  loadStatus(FieldName: string) {
    try {
      this.selectListService.PopulateList('HR', 'EmployeeLoan', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StatusList = response.Data.Items;
            }
            console.log(this.StatusList);
          },
        });
    }
    catch (error) {

    }
  }

  onItemSelect(event: any): void {
    this.form.get('EmployeeID')?.setValue(event.value.EmployeeID || null);
    this.form.get('EmployeeName')?.setValue(`${event.value.EmployeeCode}   ${event.value.EmployeeName}`);
    this.form.get('MobileNo')?.setValue(event.value.MobileNo || null);
    this.form.get('EmployeeTypeName')?.setValue(event.value.EmployeeTypeName || null);
    this.form.get('DesignationName')?.setValue(event.value.DesignationName || null);
    this.form.get('DepartmentName')?.setValue(event.value.DepartmentName || null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLoanChange(): void {
    const LoanTypeID = this.form.get('LoanTypeID')?.value;
    const selectedLoanType = this.LoanTypeList?.find(loan => loan.LoanTypeID === LoanTypeID);
    this.form.get('InterestRate')?.setValue(selectedLoanType?.InterestRate || 0);
  }

  calculateInstalment(): void {
    const loanAmount = this.form.get('LoanAmount')?.value || 0;
    const loanPeriod = this.form.get('LoanPeriod')?.value || 0;
    const interestRate = this.form.get('InterestRate')?.value || 0;

    if (loanAmount > 0 && loanPeriod > 0 && interestRate >= 0) {
      const monthlyRate = interestRate / 12 / 100;
      const totalInterest = loanAmount * monthlyRate * loanPeriod;
      const totalRepayment = loanAmount + totalInterest;
      const instalmentAmount = totalRepayment / loanPeriod;

      this.form.get('InterestAmount')?.setValue(totalInterest.toFixed(2));
      this.form.get('InstalmentAmount')?.setValue(instalmentAmount.toFixed(2));
    }
  }

  loadLoanType(): void {
    try {
      this.loanTypeService.PopulateList(null, 'SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.LoanTypeList = response.Data.Items;
          }
          else {
            this.LoanTypeList = [];
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
            const model: EmployeeLoan = {
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

  createRecord(model: EmployeeLoan): void {
    try {
      this.pageService.CreateRecord(model)
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

  updateRecord(model: EmployeeLoan): void {
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
                this.router.navigate(['/HR/EmployeeLoan/Index']);
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
      this.EmployeeLoanID = +params['id'];
      if (this.EmployeeLoanID) {
        this.isEditMode = true;

        try {
          this.pageService.GetDetails(this.EmployeeLoanID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  const model = {
                    ...response.Data,
                    dtEmployeeLoanDate: DateUtils.toDate(response.Data.dtEmployeeLoanDate),
                    InstalmentStartDate: DateUtils.toDate(response.Data.InstalmentStartDate),
                    EmployeeName: `${response.Data.EmployeeCode}  ${response.Data.EmployeeName}`,
                  };

                  console.log(response.Data);
                  this.form.patchValue(model);
                  this.calculateInstalment();

                  if (response.Data.StatusID === 2) {
                    this.isUpdateDisabled = true;
                  } else {
                    this.isUpdateDisabled = false;
                  }
                }
                else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
              error: (error) => {
                console.error(error);
              }
            });
        }
        catch (error) {
          console.error(error);
        }
      }
    });
  }


  onClickPageHeaderAddButton(): void {
    try {
      this.router.navigate(['/HR/EmployeeLoan/Index']);
    }
    catch (error) {

    }
  }

  onReset(): void {
    this.alertService.showConfirmation({
      text: 'Do you really want to reset the form?',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        this.form.reset();
        this.alertService.showAlert({
          type: 'success',
          text: 'Form has been reset.',
          timer: 300
        });
      }
    });
  }

  dbClick(): void {
    this.form.get('EmployeeName')?.setValue(null);
    this.form.get('MobileNo')?.setValue(null);
    this.form.get('EmployeeTypeName')?.setValue(null);
    this.form.get('DesignationName')?.setValue(null);
    this.form.get('DepartmentName')?.setValue(null);
  }
}



















