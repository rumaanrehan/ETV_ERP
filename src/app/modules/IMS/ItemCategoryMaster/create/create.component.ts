import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormSidebarComponent } from '../../../../shared/components/form-sidebar/form-sidebar.component';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormService } from '../../../../shared/services/form.service';
import { FormConfigType } from '../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { ItemCategoryMasterService } from '../item-category-master.service';
import { ItemGroup_SelectList } from '../../../../components/Item-Group/item-group';
import { ItemCategoryMaster } from '../item-category-master';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormSidebarComponent, ReactiveFormsModule, CommonModule, ZFormControlsModule],
  providers: [FormService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Output() closeSidebarEvent: EventEmitter<void> = new EventEmitter();

  isFormSidebarVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<ItemCategoryMaster>;

  // itemGroupList: ItemGroup_SelectList[] = [];

  itemGroupList: ItemGroup_SelectList[] = [
    { ItemGroupID: 1, ItemGroupName: "Random Group" }]


  constructor(
    private pageService: ItemCategoryMasterService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<ItemCategoryMaster>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    this.loadDropdownList;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickPageHeaderAddButton(): void {
    try {
      this.router.navigate(['/ims/product-master/index']);
    }
    catch (error) {

    }
  }
  
  loadDropdownList(){
    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if(data.itemGroupList.IsSuccess) {
            // this.itemGroupList = data.itemGroupList.Data.Items;
          }
        }
    });
  }

  resetForm(): void{
    this.formService.resetFormValue<ItemCategoryMaster>(this.formConfig, this.form);
  }

  openSidebar(isEditMode: boolean, model: ItemCategoryMaster): void {
    this.isEditMode = isEditMode;
    
    this.form.patchValue({
      ...model,
      ItemCategoryID: model.ItemCategoryID,
    });
    this.isFormSidebarVisible = true;
  }

  closeSidebar(): void {
    this.isFormSidebarVisible = false;
    this.isEditMode = false;
    this.formService.resetFormValue<ItemCategoryMaster>(this.formConfig, this.form);

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
            const model: ItemCategoryMaster = {
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
  
  createRecord(model: ItemCategoryMaster): void {
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

  updateRecord(model: ItemCategoryMaster): void {
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

  // loadCategory(): void {
  //   try {
  //     this.componentService.CategoryTypePopulateList('SelectList').subscribe({
  //       next: (response) => {
  //         if (response.IsSuccess) {
  //           this.CategoryList = response.Data.Items;
  //           this.defaultCategoryTypeID =
  //             this.CategoryList.find((Category) => true)?.CategoryTypeID ??
  //             this.CategoryList[0].CategoryTypeID;
  //           this.form
  //             .get('CategoryTypeID')
  //             ?.setValue(this.defaultCategoryTypeID);
  //         } else {
  //           this.CategoryList = [];
  //         }
  //       },
  //     });
  //   } catch (error) {}
  // }

  getDetails(): void {
    this.route.params.subscribe((params) => {
      const ProductID = +params['id'];
      if (ProductID) {
        this.isEditMode = true;
        try {
          this.pageService.GetDetails(ProductID)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                if (response.IsSuccess) {
                  this.form.patchValue(response.Data);
                }
                else {
                  this.alertService.showServerResponseAlert(response);
                }
              },
            });
        }
        catch (error) {
        }
      }
    });
  }

  // getDetails() {
  //   this.componentService
  //     .GetDetails(this.Id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);

  //         if (response.IsSuccess) {
  //           this.details = response.Data;
  //           this.patchValues();
  //         } else {
  //           this.alertService.showServerResponseAlert(response);
  //         }
  //       },
  //     });
  // }

  // patchValues() {
  //   this.form.patchValue({
  //     CategoryID: this.details.CategoryID,
  //     CategoryCode: this.details.CategoryCode,
  //     CategoryName: this.details.CategoryName,
  //     CategoryTypeID: this.details.CategoryTypeID,
  //   });
  // }

  

  // openSidebar(isEditMode: boolean, model: ItemCategoryMaster): void {
  //   this.isEditMode = isEditMode;
  //   this.form.patchValue({
  //     ...model,
  //     ItemCategoryID: model.ItemCategoryID,
  //   });
  //   this.isFormSidebarVisible = true;



    
  //   // if (isEditMode && model) {
  //   //   this.isEditMode = isEditMode;
  //   //   this.ActiveStatus = ActiveStatus;
  //   // }
  //   // if (!isEditMode) {
  //   //   model.CategoryID = this.defaultCategoryTypeID;
  //   // }
  //   // this.form.patchValue({
  //   //   ...model,
  //   //   CountryID: model.CategoryID,
  //   // });
  //   // this.ActiveStatus = ActiveStatus;
  //   // this.form.patchValue(model);
  //   // this.isFormSidebarVisible = true;
  // }

  // closeSidebar(): void {
  //   this.router.navigate([`/IMS/CategoryMaster/Index`]);
  //   this.isFormSidebarVisible = false;
  //   this.isEditMode = false;
  //   this.formService.resetFormValue<ItemCategoryMaster>(this.formConfig, this.form);

  //   setTimeout(() => {
  //     this.closeSidebarEvent.emit();
  //   }, 1);
  // }

  // onSubmit(): void {
  //   if (this.isSubmitted) return;
  //   this.isSubmitted = true;
  //   console.log('on submit clicked...');

  //   // if (this.form.invalid) {
  //   //   this.form.markAllAsTouched();
  //   //   this.formService.validateFormFields(this.formConfig, this.form);
  //   //   this.alertService.showValidationAlert();
  //   //   this.isSubmitted = false;
  //   //   return;
  //   // }

  //   console.log('clicked');
  //   // console.log('Form data:', this.form.value);
  //   const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  //   if (this.isEditMode) {
  //     this.alertService
  //       .showConfirmationWithInput({ text: 'Do you really want to Update?' })
  //       .then((result) => {
  //         if (result.isConfirmed) {
  //           const model: ItemCategoryMaster = {
  //             ...this.formService.transformFormData(this.form.value),
  //             // CreatedByDateTime: currentDate,
  //             // ModifiedDateTime: currentDate,
  //             ReasonToUpdate: result.value,
  //           };
  //           console.log('clicked..');
  //           this.updateRecord(model);
  //         } else {
  //           this.isSubmitted = false;
  //         }
  //       });
  //   } else {
  //     console.log('in create condition');
  //     const categoryData: ItemCategoryMaster = {
  //       ...this.formService.transformFormData(this.form.value),
  //       ActiveStatus: true,
  //     };
  //     // const categoryData = this.formService.transformFormData(this.form.value)
  //     // console.log('Sending to backend:', categoryData);
  //     this.createRecord(categoryData);
  //   }
  // }

  // createRecord(model: ItemCategoryMaster): void {
  //   model.CategoryCode = `C0000${this.Id}`;
  //   console.log(model);
  //   this.componentService
  //     .CreateCategory(model)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((response) => {
  //       if (response.IsSuccess) {
  //         this.closeSidebar();
  //         this.alertService.showAlert({
  //           type: 'success',
  //           text: response.Message,
  //           timer: 5000,
  //         });
  //       } else {
  //         console.log(model);
  //         this.alertService.showServerResponseAlert(response);
  //       }
  //       this.isSubmitted = false;
  //     });
  // }

  // updateRecord(model: ItemCategoryMaster): void {
  //   model.CategoryID = this.Id;
  //   model.ActiveStatus = true;
  //   console.log(model.CategoryID);
  //   console.log('mymodel  ', model);
  //   this.componentService
  //     .UpdateCategory(model)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((response) => {
  //       if (response.IsSuccess) {
  //         console.log('closing');
  //         // this.router.navigate(['/IMS/CategoryMaster/Index']);
  //         this.closeSidebar();
  //         this.alertService.showAlert({
  //           type: 'success',
  //           text: response.Message,
  //           timer: 5000,
  //         });
  //       } else {
  //         this.alertService.showServerResponseAlert(response);
  //       }
  //       this.isSubmitted = false;
  //     });
  // }

  // resetForm(): void {
  //   this.formService.resetFormValue<ItemCategoryMaster>(this.formConfig, this.form);
  // }
}
