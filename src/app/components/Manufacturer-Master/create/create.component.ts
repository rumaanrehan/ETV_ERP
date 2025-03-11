import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild, } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormSidebarComponent } from '../../../shared/components/form-sidebar/form-sidebar.component';
import { FormService } from '../../../shared/services/form.service';
import { FormConfigType } from '../../../shared/models/form.model';
import { ManufacturerMaster } from '../manufacturer-master';
import { ManufacturerMasterService } from '../manufacturer-master.service';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { ZFormControlsModule } from '../../../shared/components/z-form-controls/z-form-controls.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderService } from '../../../shared/services/page-header.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    FormSidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    ZFormControlsModule,
  ],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnInit, OnDestroy {
  @ViewChild('pageHeaderActionTemplate', { static: true })
  pageHeaderActionTemplate!: TemplateRef<any>;

  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;
  Id!: number;
  form!: FormGroup;
  formConfig!: FormConfigType<ManufacturerMaster>;
  details?: any;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private manufacturerService: ManufacturerMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private pageHeaderService: PageHeaderService
  ) { }
  ngOnInit(): void {
    this.formConfig = this.manufacturerService.getFormConfig();
    this.form = this.formService.createFormGroup<ManufacturerMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    // if (this.Id) {
    //   this.getDetails();
    //   this.isEditMode = true;
    // }
  }

  getDetails() {
    this.manufacturerService
      .GetDetails(this.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.details = response.Data;
            this.patchValues();
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
  }

  patchValues() {
    this.form.patchValue({
      ManufacturerId: this.details.ManufacturerId,
      ManufacturerCode: this.details.ManufacturerCode,
      ManufacturerName: this.details.ManufacturerName,
      ActiveStatus: this.details.ActiveStatus,
    });
  }

  getId() {
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.Id = params.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSidebar(ActiveStatus: boolean, isEditMode: boolean, model: ManufacturerMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ManufacturerMaster>(this.formConfig, this.form);

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  onSubmit(): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    if (this.isEditMode) {
      this.alertService
        .showConfirmationWithInput({ text: 'Do you really want to Update?' })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ManufacturerMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value,
            };
            this.updateRecord(model);
          } else {
            this.isSubmitted = false;
          }
        });
    } else {
      const manufacturerData = this.formService.transformFormData(this.form.value);
      this.createRecord(manufacturerData);
    }
  }

  updateRecord(model: ManufacturerMaster): void {
    try {
      this.manufacturerService.Update(model)
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
              this.alertService.showServerResponseAlert({
                Status: response.Status,
                Message: response.Message,
                ValidationErrors: response.ValidationErrors
              });
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

  createRecord(model: ManufacturerMaster): void {
    this.manufacturerService.Create(model)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.IsSuccess) {
          this.closeSidebar();
          this.alertService.showAlert({
            type: 'success',
            text: response.Message,
            timer: 5000,
          });
        } else {
          this.alertService.showServerResponseAlert(response);
        }
        this.isSubmitted = false;
      });
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['manufacturer-master/index']);
  }

  deleteRecord(id: any): void {
    this.alertService
      .showConfirmation({ text: 'Do you really want to delete this record?' })
      .then((result) => {
        if (result.isConfirmed) {
          this.manufacturerService
            .DeleteReactivate(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((response) => {
              if (response.IsSuccess) {
                this.alertService.showAlert({
                  type: 'success',
                  text: 'Manufacturer deleted successfully',
                  timer: 5000,
                });
              } else {
                this.alertService.showServerResponseAlert(response);
              }
            });
        }
      });
  }

  resetForm(): void {
    this.formService.resetFormValue<ManufacturerMaster>(this.formConfig, this.form);
  }
}