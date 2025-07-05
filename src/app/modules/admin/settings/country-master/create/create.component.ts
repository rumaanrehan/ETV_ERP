// import {
//   Component,
//   EventEmitter,
//   OnDestroy,
//   OnInit,
//   Output
// } from '@angular/core';

// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';
// import { Subject, takeUntil } from 'rxjs';

// import { FormSidebarComponent } from '../../../../../shared/components/form-sidebar/form-sidebar.component';
// import { ShowValidationTooltipDirective } from '../../../../../shared/layouts/directives/show-validation-tooltip.directive';
// import {
//   FormErrors,
//   FormValidationMessages
// } from '../../../../../shared/models/form.model';
// import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
// import { FormService } from '../../../../../shared/services/form.service';
// import { CountryMaster } from '../country-master';

// import { CountryMasterService } from '../country-master.service';

// @Component({
//   selector: 'app-create',
//   standalone: true,
//   imports: [
//     FormSidebarComponent,
//     ReactiveFormsModule,
//     ShowValidationTooltipDirective
//   ],
//   providers: [FormService],
//   templateUrl: './create.component.html',
//   styleUrls: ['./create.component.scss']
// })
// export class CreateComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>();

//   @Output() closeSidebarEvent = new EventEmitter<void>();

//   isFormSidebarVisible = false;
//   isEditMode = false;

//   model: CountryMaster = new CountryMaster();
//   mainForm!: FormGroup;

//   formValidationMessages: FormValidationMessages = {};
//   formErrors: FormErrors = {};

//   constructor(
//     private countryService: CountryMasterService,
//     private formBuilder: FormBuilder,
//     private formService: FormService,
//     private alertService: AlertNotificationService
//   ) { }

//   ngOnInit(): void {
//     this.initializeFormValidation();
//     this.mainForm = this.createFormFromModel(this.model);
//     this.formService.setValidationMessages(
//       this.formValidationMessages,
//       this.formErrors,
//       this.mainForm
//     );
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private initializeFormValidation(): void {
//     this.formErrors = {
//       CountryID: '',
//       CountryName: '',
//       CountryISOCode: '',
//       IsDefault: ''
//     };

//     this.formValidationMessages = {
//       CountryID: {
//         required: 'CountryID is required.'
//       },
//       CountryName: {
//         required: 'Country Name is required.',
//         maxlength: 'Country name cannot be longer than 50 characters.'
//       },
//       CountryISOCode: {
//         minlength: 'ISO Code must be 2 characters long.',
//         maxlength: 'ISO Code must be 2 characters long.'
//       },
//       IsDefault: {
//         required: 'IsDefault is required.'
//       }
//     };
//   }

//   createFormFromModel(model: CountryMaster): FormGroup {
//     return this.formBuilder.group({
//       CountryID: [
//         model.CountryID ?? '',
//         this.isEditMode ? [Validators.required] : []
//       ],
//       CountryCode: [model.CountryCode ?? 'NEW'],
//       CountryName: [
//         model.CountryName ?? '',
//         [Validators.required, Validators.maxLength(50)]
//       ],
//       CountryISOCode: [
//         model.CountryISOCode ?? '',
//         [Validators.minLength(2), Validators.maxLength(2)]
//       ],
//       IsDefault: [model.IsDefault ?? false]
//     });
//   }

//   openSidebar(isEditMode: boolean, model: CountryMaster = new CountryMaster()): void {
//     this.isEditMode = isEditMode;
//     this.model = model;
//     this.mainForm = this.createFormFromModel(this.model);
//     this.formService.setValidationMessages(
//       this.formValidationMessages,
//       this.formErrors,
//       this.mainForm
//     );
//     this.isFormSidebarVisible = true;
//   }

//   closeSidebar(): void {
//     this.isFormSidebarVisible = false;
//     this.isEditMode = false;
//     this.resetForm();

//     setTimeout(() => {
//       this.closeSidebarEvent.emit();
//     }, 1);
//   }
//   resetForm() {
//     throw new Error('Method not implemented.');
//   }

//   onSubmit(): void {
//     if (this.mainForm.invalid) {
//       this.mainForm.markAllAsTouched();
//       this.formService.validateForm(
//         this.formValidationMessages,
//         this.formErrors,
//         this.mainForm
//       );
//       this.alertService.showValidationToast(this.formErrors);
//       const invalidControl = document.querySelector(
//         'input.ng-invalid, textarea.ng-invalid, select.ng-invalid'
//       ) as HTMLElement;
//       invalidControl?.focus();
//       return;
//     }

//     const formData = this.mainForm.getRawValue() as CountryMaster;

//     if (this.isEditMode) {
//       this.alertService
//         .showConfirmationWithInput({
//           text: 'Do you really want to Update?'
//         })
//         .then((result) => {
//           if (result.isConfirmed) {
//             const updatedData: CountryMaster = {
//               ...formData,
//               ReasonToUpdate: result.value
//             };
//             this.updateRecord(updatedData);
//           }
//         });
//     } else {
//       this.createRecord(formData);
//     }
//   }
//   updateRecord(updatedData: CountryMaster) {
//     throw new Error('Method not implemented.');
//   }
//   createRecord(formData: CountryMaster) {
//     throw new Error('Method not implemented.');
//   }

//   //   private createRecord(model: CountryMaster): void {
//   //     this.countryService
//   //       .CreateRecord(model)
//   //       .pipe(takeUntil(this.destroy$))
//   //       .subscribe({
//   //         next: (response) => {
//   //           if (response.IsSuccess) {
//   //             this.alertService.showAlert({
//   //               type: 'success',
//   //               text: response.Message,
//   //               timer: 5000
//   //             });
//   //             this.closeSidebar();
//   //           } else {
//   //             this.alertService.showServerResponseAlert({
//   //               Status: response.Status,
//   //               Message: response.Message,
//   //               ValidationErrors: response.ValidationErrors,
//   //               IsSuccess: undefined
//   //             });
//   //           }
//   //         }
//   //       });
//   //   }

//   //   private updateRecord(model: CountryMaster): void {
//   //     this.countryService
//   //       .UpdateRecord(model)
//   //       .pipe(takeUntil(this.destroy$))
//   //       .subscribe({
//   //         next: (response) => {
//   //           if (response.IsSuccess) {
//   //             this.alertService.showAlert({
//   //               type: 'success',
//   //               text: response.Message,
//   //               timer: 5000
//   //             });
//   //             this.closeSidebar();
//   //           } else {
//   //             this.alertService.showServerResponseAlert({
//   //               Status: response.Status,
//   //               Message: response.Message,
//   //               ValidationErrors: response.ValidationErrors,
//   //               IsSuccess: undefined
//   //             });
//   //           }
//   //         }
//   //       });
//   //   }

//   //   private resetForm(): void {
//   //     this.mainForm.reset({
//   //       CountryID: '',
//   //       CountryCode: 'NEW',
//   //       CountryName: '',
//   //       CountryISOCode: '',
//   //       IsDefault: false
//   //     });
//   //     this.model = new CountryMaster(); // Reset model instance
//   //   }
//   // }
// }
