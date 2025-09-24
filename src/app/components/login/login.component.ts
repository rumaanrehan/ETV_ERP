import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { UserAuthenticateRequest } from '../../core/models/user';
import { MenuService } from '../../core/services/menu.service';
import { RequestContextService } from '../../core/services/request-context.service';
import { UserRolePermissionsService } from '../../core/services/user-role-permissions.service';
import { UserStateService } from '../../core/services/user-state.service';
import { UserService } from '../../core/services/user.service';
import { ShowValidationTooltipDirective } from '../../shared/layouts/directives/show-validation-tooltip.directive';
import { FormConfigType } from '../../shared/models/form.model';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { FormService } from '../../shared/services/form.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [FormValidationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private destroy$ = new Subject<void>();

  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<UserAuthenticateRequest>;
  //public showLoader: boolean | undefined;
  // public formValidationMessages: FormValidationMessages = {};
  // public formErrors: FormErrors = {};
  public showPassword: boolean = false;
  public toggleClass = 'ri-eye-off-line';

  returnUrl: string = '/';

  constructor(
    private pageService: UserService,
    private formService: FormService,
    public userRolePermissionsService: UserRolePermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    // private formBuilder: FormBuilder,
    // private formValidationService: FormValidationService,
    private alertService: AlertNotificationService,
    private requestContextService: RequestContextService,
    private userStateService: UserStateService,
    private menuService: MenuService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.GetLoginFormConfig();
    this.form = this.formService.createFormGroup<UserAuthenticateRequest>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);


    // this.formErrors = {
    //   'Username': '',
    //   'Password': ''
    // };

    // this.formValidationMessages = {
    //   'Username': {
    //     'required': 'Username is required.'
    //   },
    //   'Password': {
    //     'required': 'Password is required.',
    //     'minlength': 'Password must be at least 5 characters long.'
    //   }
    // };

    // this.form = this.formBuilder.group({
    //   Username: ['', [Validators.required]],
    //   Password: ['', [Validators.required, Validators.minLength(5)]],
    // });
    // this.formValidationService.setValidationMessages(this.formValidationMessages, this.formErrors, this.form);

    this.menuService.moduleCode.set(null);

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // throwError(() => 'error');

    if (this.requestContextService.AccessToken != null && this.returnUrl == '/') {
      this.userStateService.rehydrate();
      this.router.navigateByUrl("home");
    }
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

      this.Authenticate(this.formService.transformFormData(this.form.value));
    }
    catch (error) {

    }

    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   //this.focusInvalidControl();
    //   // this.formValidationService.validateForm(this.formValidationMessages, this.formErrors, this.form);
    // }
    // else {
    //   //debugger;
    //   //const { Username, Password } = this.loginForm.value;
    //   const request: UserAuthenticateRequest = this.form.value;
    //   this.pageService.Authenticate(request).subscribe(
    //     {
    //       next: (response: any) => {
    //         // Handle successful login
    //         if (response.Token) {
    //           localStorage.setItem('authToken', response.Token);
    //         }
    //         // this.userRolePermissionsService.loadUserRolePermissions();
    //         if(this.returnUrl !== '/'){
    //           this.router.navigateByUrl(this.returnUrl);
    //         }
    //         else{
    //           this.router.navigate(['/home']);
    //         }
    //         //this.router.navigateByUrl("crm");
    //       }
    //     }
    //   );
    // }
  }

  Authenticate(request: UserAuthenticateRequest): void {
    try {
      this.pageService.Authenticate(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.userStateService.setUser(response.Data.User);
              if (this.returnUrl !== '/') {
                console.log("returnUrl", response);
                this.router.navigateByUrl(this.returnUrl);
              }
              else {
                console.log("Non Return URL", response);
                this.router.navigate(['/home']);
              }
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

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }

  private focusInvalidControl() {
    const firstInvalidControl = Object.keys(this.form.controls).find(key => this.form.get(key)?.invalid);
    if (firstInvalidControl) {
      const controlElement = document.querySelector(`[formControlName=${firstInvalidControl}]`) as HTMLElement;
      controlElement?.focus();
    }
  }
}
