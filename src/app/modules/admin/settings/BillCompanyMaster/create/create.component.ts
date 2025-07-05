import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { CountryMaster} from '../../country-master/country-master';
import { CountryMasterService } from '../../country-master/country-master.service';
import { StateMaster, StateMaster_SelectList } from '../../StateMaster/state-master';
import { StateMasterService } from '../../StateMaster/state-master.service';
import { BillCompanyMaster } from '../bill-company-master';
import { BillCompanyMasterService } from '../bill-company-master.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, DropdownModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;  //For Button Disabled.
  form!: FormGroup;
  formConfig!: FormConfigType<BillCompanyMaster>;
  CountryList: CountryMaster[] = [];
  StateList: StateMaster_SelectList[] = [];
  defaultCountryID: number | null = null;
  defaultStateID: number | null = null;

  constructor(
    private pageService: BillCompanyMasterService,
    private countryService: CountryMasterService,
    private stateService: StateMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<BillCompanyMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadCountry();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: BillCompanyMaster): void {
    this.isEditMode = isEditMode;
    this.ActiveStatus = ActiveStatus;

    if (!isEditMode) {
      model.BillCompanyCountryID = this.defaultCountryID;
      model.BillCompanyStateID = this.defaultStateID;
    }
    this.loadState(model.BillCompanyCountryID, isEditMode, model.BillCompanyStateID);
    this.form.patchValue({
      ...model,
      BillCompanyCountryID: model.BillCompanyCountryID,
    });
    this.isFormSidebarVisible = true;
  }

  loadCountry(): void {
    try {
      this.countryService.PopulateList('SelectList')
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.CountryList = response.Data.Items;
            this.defaultCountryID = this.CountryList.find(country => true)?.CountryID ?? this.CountryList[0].CountryID;
            this.form.get('BillCompanyCountryID')?.setValue(this.defaultCountryID);
            this.loadState(this.defaultCountryID);
          } else {
            this.CountryList = [];
            this.alertService.showServerResponseAlert( {
              Status: response.Status,
              Message: response.Message
            });
          }
        },
      });
    }
    catch (error) {

    }
  }

  loadState(CountryID: any, isEditMode: boolean = false, selectedStateID: number | null = null): void {
    try {
      this.stateService.PopulateList('S')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StateList = response.Data.Items;
              // const stateToSet = isEditMode ? selectedStateID : this.StateList.find(state => state.IsDefault)?.StateID ?? this.StateList[0]?.StateID;
              // this.defaultStateID = this.StateList.find(state => state.IsDefault)?.StateID ?? this.StateList[0]?.StateID;
              // if (stateToSet) {
              //   this.form.get('BillCompanyStateID')?.setValue(stateToSet);
              // }
            } else {
              this.StateList = [];
            }
          },
        });
    }
    catch (error) {

    }
  }

  onCountryChange(event: DropdownChangeEvent): void {
    const CountryID = this.form.get('BillCompanyCountryID')?.value;
    if (CountryID) {
      this.loadState(CountryID);
    } else {
      this.StateList = [];
    }
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<BillCompanyMaster>(this.formConfig, this.form);

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
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            const model: BillCompanyMaster = {
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

  createRecord(model: BillCompanyMaster): void {
    try {
      this.pageService.CreateRecord(model)
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

  updateRecord(model: BillCompanyMaster): void {
    try {
      this.pageService.UpdateRecord(model)
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
}
