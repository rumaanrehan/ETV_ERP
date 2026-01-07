import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserProfile } from '../../../core/models/user';
import { UserStateService } from '../../../core/services/user-state.service';
import { UserService } from '../../../core/services/user.service';
import { ZInputTextComponent } from '../../../shared/components/z-form-controls/z-input-text/z-input-text.component';
import { FormConfigType } from '../../../shared/models/form.model';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { FormService } from '../../../shared/services/form.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ZInputTextComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isSubmitted = false;
  isResetting  = false;

  form!: FormGroup;
  formConfig!: FormConfigType<UserProfile>;

  constructor(
    private userService: UserService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  private userStateService: UserStateService
  ) {
  }

  ngOnInit(): void {
    this.formConfig = this.userService.GetUserProfileFormConfig();
    this.form = this.formService.createFormGroup<UserProfile>(this.formConfig);
    this.form.setValidators(this.passwordMatchValidator('NewPassword', 'ConfirmPassword'));
    this.form.updateValueAndValidity(); 
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    const user = this.userStateService.user;
    if (user?.UserFullName) {
      this.form.patchValue({
        UserFullName: user.UserFullName
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get isPasswordMismatch(): boolean {
    return !!this.form?.errors?.['passwordMismatch'];
  }

  get user() {
    return this.userStateService.user;
  }

  updatePassword(){
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

      this.userService.UpdatePassword(this.formService.transformFormData(this.form.value))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
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

  private passwordMatchValidator(passwordKey: string, confirmPasswordKey: string) {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordKey)?.value;
      const confirm = form.get(confirmPasswordKey)?.value;

      if (!password || !confirm) return null;

      return password === confirm
        ? null
        : { passwordMismatch: true };
    };
  }
}
