import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowValidationTooltipDirective } from '../../shared/layouts/directives/show-validation-tooltip.directive';
import { DTO } from '../../shared/models/dto.model';
import { AuthenticationService } from '../../shared/services/auth.service';
import { FormErrors, FormValidationMessages, FormValidationService } from '../../shared/services/form-validation.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule, ShowValidationTooltipDirective],
  providers: [FormValidationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  //public showLoader: boolean | undefined;
  public formValidationMessages: FormValidationMessages = {};
  public formErrors: FormErrors = {};
  public showPassword: boolean = false;
  public toggleClass = 'ri-eye-off-line';

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private formValidationService: FormValidationService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.formErrors = {
      'Username': '',
      'Password': ''
    };

    this.formValidationMessages = {
      'Username': {
        'required': 'Username is required.'
      },
      'Password': {
        'required': 'Password is required.',
        'minlength': 'Password must be at least 5 characters long.'
      }
    };

    this.loginForm = this.formBuilder.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.formValidationService.setValidationMessages(this.formValidationMessages, this.formErrors, this.loginForm);

    //this.loaderService.show();
  }

  checkCapsLock(event: KeyboardEvent): void {
    const passwordCapsTooltip = document.getElementById('password-capslock-tooltip');
    if (passwordCapsTooltip) {
      if (event.getModifierState('CapsLock')) {
        passwordCapsTooltip.classList.remove('d-none');
      } else {
        passwordCapsTooltip.classList.add('d-none');
      }
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      //this.focusInvalidControl();
      this.formValidationService.validateForm(this.formValidationMessages, this.formErrors, this.loginForm);
    }
    else {
      //debugger;
      //const { Username, Password } = this.loginForm.value;
      const dto: DTO = this.loginForm.value;
      this.authenticationService.login(dto).subscribe(
        {
          next: (response: any) => {
            // Handle successful login
            if (response.Token) {
              localStorage.setItem('authToken', response.Token);
            }
            this.router.navigate(['/emptypage']);
            //this.router.navigateByUrl("crm");
          }
        }
      );
    }
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }

  private focusInvalidControl() {
    const firstInvalidControl = Object.keys(this.loginForm.controls).find(key => this.loginForm.get(key)?.invalid);
    if (firstInvalidControl) {
      const controlElement = document.querySelector(`[formControlName=${firstInvalidControl}]`) as HTMLElement;
      controlElement?.focus();
    }
  }
}
