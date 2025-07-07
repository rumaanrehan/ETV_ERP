import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ItemGroup_SelectList } from '../../../../components/Item-Group/item-group';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../shared/services/form.service';
import { PortMaster } from '../port-master';
import { PortMasterService } from '../port-master.service';
import { StaticList } from '../../../../shared/models/select-list';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
portList: StaticList[] = [
    {iValue:1, Text:'Airport', cValue:''},
    {iValue:2, Text:'Seaport', cValue:''},
    {iValue:3, Text:'TransPort', cValue:''},
    {iValue:4, Text:'', cValue:''},
    {iValue:5, Text:'Seaport', cValue:''},

  ];
onCancel() {
throw new Error('Method not implemented.');
}
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  activeStatus: boolean = false;
  
  form!: FormGroup;
  formConfig!: FormConfigType<PortMaster>;

  itemGroupList: ItemGroup_SelectList[] = [];

  constructor(
    private pageService: PortMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
  ) {}

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<PortMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadDropdownList(): void{
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if(data.itemGroupList.IsSuccess) {
            this.itemGroupList = data.itemGroupList.Data.Items;
          }
        }
    });
  }

  openSidebar(activeStatus: boolean, isEditMode: boolean, model: PortMaster): void {
    if (isEditMode && model) {
      this.isEditMode = isEditMode;
    }
    this.activeStatus = activeStatus;
    this.form.patchValue(model);
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<PortMaster>(this.formConfig, this.form);

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
            const model: PortMaster = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(this.formService.transformFormData(model));
            console.log(model)
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
  
  createRecord(model: PortMaster): void {
    console.log(model);
    try {
      this.pageService.CreateRecord(model)
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

  updateRecord(model: PortMaster): void {
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