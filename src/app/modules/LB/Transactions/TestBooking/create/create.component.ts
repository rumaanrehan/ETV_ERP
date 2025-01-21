import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ZDialogComponent } from '../../../../../shared/components/z-dialog/z-dialog.component';
import { AutoCompleteDef } from '../../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList, StaticListRequest } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { SelectListService } from '../../../../../shared/services/select-list.service';
import { TestBooking, TestBooking_BookingDetails, TestBooking_ConsultantList, TestBooking_PatientDetails } from '../test-booking';
import { TestBookingService } from '../test-booking.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ZFormControlsModule,ZDialogComponent],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  @ViewChild('inPackageTemplate', { static: true }) inPackageTemplate!: TemplateRef<any>;
  @ViewChild('actionColTemplate', { static: true }) actionColTemplate!: TemplateRef<any>;
  @ViewChild('statusTextTemplate', { static: true }) statusTextTemplate!: TemplateRef<any>;//yeh use nahi hai abhi
  
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<TestBooking>;
  patientAutoCompleteDef!: AutoCompleteDef<TestBooking_PatientDetails>;
  consultantCategoryList: StaticList[] = [];
  consultantAutoCompleteDef!: AutoCompleteDef<TestBooking_ConsultantList>;

  serviceForm!: FormGroup;
  serviceFormConfig!: FormConfigType<TestBooking_BookingDetails>;
  serviceSearchBy: number = 1;
  serviceSearchByList: StaticList[] = [];
  serviceAutoCompleteDef!: AutoCompleteDef<TestBooking_BookingDetails>;
  selectedService!: TestBooking_BookingDetails;
  tableDef!: TableDef<TestBooking_BookingDetails>;
  isVisibleServiceDialog: boolean = false;
  
  constructor(
    private pageService: TestBookingService,
    private selectListService: SelectListService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    
    /* Main Form */
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<TestBooking>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    this.loadSettings();
    //based on settings date and time value will be set
    this.form.get('BookingDate')?.setValue(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    this.form.get('BookingTime')?.setValue(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));

    this.patientAutoCompleteDef = this.pageService.getPatientAutoCompleteDef(this.formConfig, this.form);
    this.consultantAutoCompleteDef = this.pageService.getConsultantAutoCompleteDef(this.formConfig, this.form);

    // if(this.isEditMode){
    //   this.getDetails();
    // }
    this.getDetails();

    /* Service Form */
    this.serviceFormConfig = this.pageService.getServiceFormConfig();
    this.serviceForm = this.formService.createFormGroup<TestBooking_BookingDetails>(this.serviceFormConfig);
    this.formService.initializeFormValidationMessage(this.serviceFormConfig, this.serviceForm);
    
    this.loadStaticList('SearchBy', "serviceSearchByList");
    this.serviceAutoCompleteDef = this.pageService.getServiceAutoCompleteDef(this.selectedService);
    this.tableDef = this.pageService.getBookingDetailsTableDef(this);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderBackButton(): void {
    this.router.navigate(['/LB/TestBooking/Index']);
  }

  loadSettings(): void {
    try {
      const dto = { CompanyID: 1 }
      this.pageService.GetSettings(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              //set the bookingdatetime mode
            }
            else {
              if(response.Status !== 'Info') {
                this.alertService.showServerResponseAlert(response);
              }
            }
          },
        });
    } catch (error) {

    }
  }
  
  loadStaticList(fieldName: string, targetList: keyof CreateComponent): void {
    try {
      const dto: StaticListRequest = {
        AreaName: "LB",
        ControllerName: "TestBooking",
        FieldName: fieldName
      };

      this.selectListService.GetStaticList(dto)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              (this[targetList] as StaticList[]) = response.Data.Items;
            }
            else {
              (this[targetList] as StaticList[]) = [];
              this.alertService.showServerResponseAlert(response);//isko theek karna hai.
            }
          }
        });
    } catch (error) {

    }
  }
  
  loadPatient(event: string): void {
    try {
      this.pageService.GetPatient('GetPatient', event)
        .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response?.IsSuccess) {
            this.patientAutoCompleteDef.options = response.Data.Items;
          }
          else {
            this.patientAutoCompleteDef.options = [];
            if(response.Status !== 'Info'){
              this.alertService.showServerResponseAlert(response);
            }
          }
        }
      });
    } catch (error) {

    }
  }

  onSelect_Patient(event: TestBooking_PatientDetails): void {
    try {
      this.pageService.GetPatientDetails('GetPatientDetails', event.PID, event.RegistrationNo)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.form.patchValue(response.Data.Items[0]);
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    } catch (error) {

    }
  }

  onClear_RegistrationNo(): void {
    this.alertService.showConfirmation({
      text: 'Are you sure you want to clear the patient details?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formService.resetFormValue<TestBooking>(this.formConfig, this.form);
      }
    });
  }

  loadConsultant(event: string): void {
    try {
      this.pageService.GetConsultant('AutoSuggest', event)
        .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response?.IsSuccess) {
            this.consultantAutoCompleteDef.options = response.Data.Items;
          } 
          else {
            this.consultantAutoCompleteDef.options = [];
            if(response.Status !== 'Info'){
              this.alertService.showServerResponseAlert(response);
            }
          }
        }
      });
    } catch (error) {

    }
  }

  onClear_Consultant(): void{
    this.form.patchValue({
      ConsultantID: null,
      ConsultantName: null
    });
  }

  onSelect_Consultant(event: TestBooking_ConsultantList): void {
    this.form.patchValue({
      ConsultantID: event.ConsultantID,
      ConsultantName: event.ConsultantName
    });
  }

  onChange_ServiceSearchBy(): void {

  }

  focusFormControl(controlName: string) {
    // Select the input element inside the PrimeNG component based on the formControlName
    const inputElement = document.querySelector(`[formControlName="${controlName}"]`) as HTMLElement;
    console.log(inputElement);
    // Check if the element exists and then focus on it
    if (inputElement) {
      inputElement.focus();
    }
  }

  loadService(event: string): void {
    try {
      if(!this.form.get('RegistrationID')?.value) {
        // set focus to registration no;
        this.focusFormControl('RegistrationNo');
        // this.serviceAutoCompleteDef.options = [];
        this.alertService.showToast({
          type: "warning",
          text: "Please select a patient first to search for the service.",
          timer: 5000
        })
      }
      else if(this.serviceSearchBy && event) {
        const dto = {
          RegistrationID: this.form.get('RegistrationID')?.value,
          SearchBy: this.serviceSearchBy,
          SearchValue: event
        };
        
        this.pageService.GetServiceDetails(dto)
          .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.serviceAutoCompleteDef.options = response.Data.Items;
            }
            else {
              this.serviceAutoCompleteDef.options = [];
              if (response.Status !== "Info") {
                this.alertService.showServerResponseAlert(response);
              }
            }
          }
        });
      }
    } catch (error) {

    }
  }

  onSelect_Service(event: TestBooking_BookingDetails): void {
    this.selectedService = event;
    this.loadServiceCharge();
  }

  loadServiceCharge(): void {
    try {
      this.pageService.GetServiceCharge(this.form.get('RegistrationID')?.value, this.selectedService.ServiceDetailID)
        .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.selectedService.ServiceRatePerUnit = response.Data.ServiceRatePerUnit;
            this.selectedService.ServiceDiscountAmount = response.Data.ServiceDiscountAmount;
            this.serviceForm.patchValue(this.selectedService);
            
            this.showDialog();
          }
          else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  showDialog() {
    this.isVisibleServiceDialog = true;
    this.serviceAutoCompleteDef.options = [];
    this.selectedService = this.formService.createNullObject<TestBooking_BookingDetails>();//yeh diglog close pe hoga baki iska solution nikalna hai
  }

  onClickCancel() {
    this.isVisibleServiceDialog = false;
    this.selectedService = this.formService.createNullObject<TestBooking_BookingDetails>();//yeh diglog close pe hoga baki iska solution nikalna hai
  }
  
  onServiceAdd(): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    
    try {
      if (this.serviceForm.invalid) {
        this.serviceForm.markAllAsTouched();
        this.formService.validateFormFields(this.serviceFormConfig, this.serviceForm);
        this.alertService.showValidationAlert();
        this.isSubmitted = false;
        return;
      }
      else if(this.tableDef.data.some((service: TestBooking_BookingDetails) => service.ServiceDetailID === this.selectedService.ServiceDetailID)){
        this.selectedService = this.formService.createNullObject<TestBooking_BookingDetails>();//yeh diglog close pe hoga baki iska solution nikalna hai
        this.isVisibleServiceDialog = false;

        this.alertService.showToast({
          type: "warning",
          text: "Service already exists in service list.",
          timer: 5000
        });
        return;
      }
      else {
        this.tableDef.data.push(this.formService.transformFormData(this.serviceForm.value));
        this.selectedService = this.formService.createNullObject<TestBooking_BookingDetails>();//yeh diglog close pe hoga baki iska solution nikalna hai
        this.isVisibleServiceDialog = false;
        
        this.alertService.showToast({
          type: "success",
          text: "Service Successfully Added",
          timer: 5000
        });
      }
    }
    catch (error) {

    }
    finally {
      this.isSubmitted = false;
    }
  }

  onClickDelete(row: any): void {
    this.alertService.showConfirmation({
      text: `Are you sure you want to delete the service "<b>${row.ServiceCode} - ${row.ServiceName}</b>" from the service list?`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.isEditMode) {
          this.tableDef.data = this.tableDef.data.filter(item => item !== row);
          this.alertService.showToast({
            type: "success",
            text: "Service Deleted Successfully",
            timer: 5000,
          });
        } 
        else {
          this.pageService.CancelTest(row.BookingDetailID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.alertService.showAlert({
                    type: "success",
                    text: response.Message,
                    timer: 5000,
                  });
                  //this.getDetails();
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
      }
    });
  }

  get noOfServices(): number {
    return this.tableDef.data.length;
  }

  get totalAmounts(): number {
    return this.tableDef.data.reduce((sum, service) => sum + (service.ServiceAmount || 0), 0);
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

      if (this.tableDef.data.length > 0) {
        this.createRecord(this.formService.transformFormData(this.form.value));
      } else {
        this.alertService.showToast({
          type: "warning",
          text: "Please add atleast 1 service to generate the Laboratory Booking.",
          timer: 5000
        });
        this.isSubmitted = false;

      }
    }
    catch (error) {

    }
  }

  createRecord(model: TestBooking): void {
    try {
      const dto = {
        ...model,
        ServiceDetails: this.tableDef.data
      };

      this.pageService.CreateRecord(dto)
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

  resetForm(): void {
    this.alertService.showConfirmation({
      text: 'Are you sure you want to reset the page?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formService.resetFormValue<TestBooking>(this.formConfig, this.form);
      }
    });
  }

  getDetails(): void {
    this.route.params.subscribe((params) => {
      const BookingID = +params['id'];
      if (BookingID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(BookingID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  const model = {
                    ...response.Data,
                  };
                  this.form.patchValue(model);
                  this.pageService.GetAddDetailArray(BookingID)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                      next: (arrayResponse) => {
                        if (arrayResponse.IsSuccess) {
                          this.tableDef.data = arrayResponse.Data.Items;
                          this.form.get('dtBookingDate')?.setValue(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
                          this.form.get('BookingTime')?.setValue(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
                        } else {
                          if (arrayResponse.Message != "Record not found.") {
                            this.alertService.showServerResponseAlert(arrayResponse);
                          }
                        }
                      },
                    });
                } else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        } catch (error) {

        }
      }
    });
  }
}