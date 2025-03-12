import { ItemGroupMaster } from './../ItemGroupMaster';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormSidebarComponent } from '../../../shared/components/form-sidebar/form-sidebar.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ZFormControlsModule } from '../../../shared/components/z-form-controls/z-form-controls.module';
import { FormService } from '../../../shared/services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectListService } from '../../../shared/services/select-list.service';
import { AlertNotificationService } from '../../../shared/services/alert-notification.service';
import { Subject, takeUntil } from 'rxjs';
import { FormConfigType } from '../../../shared/models/form.model';
import { ItemGroupMasterService } from '../ItemGroupMaster.service';

@Component({
  selector: 'typeGroup-create',
  standalone: true,
  imports: [
    FormSidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    ZFormControlsModule,
  ],
  providers: [FormService, DatePipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();
  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  ActiveStatus: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ItemGroupMaster>;
  Id!: number;
  details?: any;
  defaultItemGroupTypeID: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private componentService: ItemGroupMasterService,
    private selectListService: SelectListService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) {}

  ngOnInit(): void {
    this.formConfig = this.componentService.getFormConfig();
    this.form = this.formService.createFormGroup<ItemGroupMaster>(
      this.formConfig
    );
    this.formService.initializeFormValidationMessage(
      this.formConfig,
      this.form
    );

    this.getId();
    if (this.Id) {
      this.getDetails();
      this.isEditMode = true;
    }
  }

  getId() {
    this.route.params.subscribe((params: any) => {
      console.log(params.id);
      if (params.id) {
        this.Id = params.id;
      }
    });
  }

  openSidebar(
    ActiveStatus: boolean,
    isEditMode: boolean,
    model: ItemGroupMaster
  ): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
      this.ActiveStatus = ActiveStatus;
    }
    if (!isEditMode) {
      model.ItemGroupID = this.defaultItemGroupTypeID;
    }
    this.form.patchValue({
      ...model,
      ItemGroupID: model.ItemGroupID,
    });
    this.ActiveStatus = ActiveStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  onSubmit(): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    if (this.isEditMode) {
      this.alertService
        .showConfirmationWithInput({ text: 'Do you really want to Update?' })
        .then((result) => {
          if (result.isConfirmed) {
            const model: ItemGroupMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value,
            };
            this.updateRecord(model);
          } else {
            this.isSubmitted = false;
          }
        });
    } else {
      const itemData: ItemGroupMaster = {
        ...this.formService.transformFormData(this.form.value),
        ActiveStatus: true,
      };
      this.createRecord(itemData);
    }
  }

  updateRecord(model: ItemGroupMaster): void {
    model.ItemGroupID = this.Id;
    this.componentService
      .UpdateCategory(model)
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

  createRecord(model: ItemGroupMaster): void {
    model.ItemGroupCode = `C0000${this.Id}`;
    this.componentService
      .CreateItemGroup(model)
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
          console.log(model);
          this.alertService.showServerResponseAlert(response);
        }
        this.isSubmitted = false;
      });
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ItemGroupMaster>(
      this.formConfig,
      this.form
    );

    setTimeout(() => {
      this.closeSidebarEvent.emit();
    }, 1);
  }

  getDetails() {
    this.componentService
      .GetDetails(this.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.IsSuccess) {
            this.details = response.Data;
            // this.patchValues();
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetForm(): void {
    this.formService.resetFormValue<ItemGroupMaster>(
      this.formConfig,
      this.form
    );
  }

  
  // patchValues() {
    // this.form.patchValue({
    //   CategoryID: this.details.CategoryID,
    //   CategoryCode: this.details.CategoryCode,
    //   CategoryName: this.details.CategoryName,
    //   CategoryTypeID: this.details.CategoryTypeID
    // });
  // }

}
