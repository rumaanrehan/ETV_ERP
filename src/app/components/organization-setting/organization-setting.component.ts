import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrganizationSettings } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { Country_SelectList } from '../../modules/admin/settings/country-master/country-master';
import { State_SelectList } from '../../modules/admin/settings/state-master/state-master';
import { ZFileUploadComponent } from "../../shared/components/z-form-controls/z-file-upload/z-file-upload.component";
import { ZFormControlsModule } from '../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../shared/models/form.model';
import { AlertNotificationService } from '../../shared/services/alert-notification.service';
import { FormService } from '../../shared/services/form.service';
import { PageHeaderService } from '../../shared/services/page-header.service';

@Component({
  selector: 'app-organization-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, ZFileUploadComponent, RouterLink],
  templateUrl: './organization-setting.component.html',
  styleUrl: './organization-setting.component.scss'
})
export class OrganizationSettingComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;

  isSubmitted = false;
  editMode = false;
  updateLogo = false;
  stateName = '';
  logoImageSrc: string | null = null;
  uploadingLogo = false;
  
  form!: FormGroup;
  logoForm!: FormGroup;
  formConfig!: FormConfigType<OrganizationSettings>;

  stateList: State_SelectList[] = []
  countryList: Country_SelectList[] = []

  constructor(
    private pageHeaderService: PageHeaderService,
    private userService: UserService,
    private formService: FormService,
    private fb: FormBuilder,
    private alertService: AlertNotificationService
  ) {  }
  
  ngOnInit(): string {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.userService.GetOrganizationSettingsFormConfig();
    this.form = this.formService.createFormGroup<OrganizationSettings>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.logoForm = this.fb.group({logo: [null]});
    this.loadCountryList();
    this.getDetails();
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCountryList(): void {
    this.userService.GetCountryList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.countryList = data.countryList.Data?.Items ?? [];
        },
      });
  }

  loadStateList(event: any): void {
    this.userService.GetStateList(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stateList = data.stateList.Data?.Items ?? [];
          this.stateName = this.stateList.find(x => x.StateID === this.form.value.StateID)?.StateName ?? '';
        },
      });
  }

  onLogoUpdate(event: any): void {
    if (!event || this.uploadingLogo) return;

    this.uploadingLogo = true;
    const formData = new FormData();
    formData.append('Logo', event);
    try {
      this.userService.UploadOrganizationLogo(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            // this.logoImageSrc = URL.createObjectURL(file);
            // this.logoForm.reset();
            // this.updateLogo = false;
            this.alertService.showAlert({
              type: 'success',
              text: response.Message,
              timer: 5000
            });
            this.ngOnInit();
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    }
    catch (error) {
      this.uploadingLogo = false;
    }
  }
  
  removeLogo(): void {
    this.userService.RemoveOrganizationLogo()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.IsSuccess) {
          this.logoImageSrc = null;
          this.alertService.showAlert({
            type: 'success',
            text: response.Message,
            timer: 5000
          });
        } else {
          this.alertService.showServerResponseAlert(response);
        }
      },
    });
  }
  
  getDetails(): void {
    try {
      this.userService.GetOrganizationDetails()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.form.patchValue(response.Data);
              this.loadStateList(response.Data?.CountryID);
              this.logoImageSrc = response.Data?.OrganizationLogoBase64 ?? null;
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

      this.alertService.showConfirmationWithInput({
        text: 'Do you really want to Update?',
        }).then(result => {
          if (result.isConfirmed) {
            const data = {
              ...this.form.value,
              ReasonToUpdate: result.value
            }
            this.updateRecord(data);
          }
          else {
            this.isSubmitted = false;
          }
      });
    }
    catch (error) {
      this.isSubmitted = false;

    }
  }
  
  updateRecord(formData: OrganizationSettings): void {
    try {
      this.userService.UpdateOrganizationDetails(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
              this.ngOnInit();
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    } catch (error) { }
  }

  getOrganizationInitial(name: string | null | undefined): string {
    if (!name || typeof name !== 'string') { return '?'; }

    const trimmed = name.trim();
    if (!trimmed) { return '?';}

    return trimmed.split(/\s+/).map((w: string) => w.charAt(0).toUpperCase()).slice(0, 2).join('');
  }
}
