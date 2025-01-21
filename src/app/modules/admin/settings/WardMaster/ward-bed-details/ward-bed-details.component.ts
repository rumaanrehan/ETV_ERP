import { CommonModule, DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { SelectList } from '../../SelectList/select-list';
import { SelectListService } from '../../SelectList/select-list.service';
import { WardMasterList, WardMaster_WardBedDetails, WardMaster_WardBedDetailsList } from '../ward-master';
import { WardMasterService } from '../ward-master.service';


@Component({
  selector: 'app-ward-bed-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule, FieldsetModule, TableModule],
  providers: [FormService, DatePipe],
  templateUrl: './ward-bed-details.component.html',
  styleUrl: './ward-bed-details.component.scss'
})
export class WardBedDetailsComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<WardMaster_WardBedDetails>;
  wardlist: WardMasterList[] = [];
  StatusList: SelectList[] = [];
  WardBedDetailsArray: any = [];
  WardMaster_WardBedDetailsList: WardMaster_WardBedDetailsList[] = [];  

  constructor(
    private pageService: WardMasterService,
    private selectListService: SelectListService,
    private pageHeaderService: PageHeaderService,
    private formService: FormService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.formConfig = this.pageService.getFormBedDetailsConfig();
    this.form = this.formService.createFormGroup<WardMaster_WardBedDetails>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.loadWardBedDetails();
    this.loadStatus('StatusID');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get WardBedDetailsMappingArray(): FormArray {
    return this.form.get('WardMapping') as FormArray;
  }

  loadWardBedDetails(): void {
    try {
      this.pageService.PopulateList('SelectList').subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.wardlist = response.Data.Items;
          } else {
            this.alertService.showServerResponseAlert(response);
          }
        },
      });
    } catch (error) {

    }
  }

  loadStatus(FieldName: any) {
    try {
      this.selectListService.PopulateList('Admin', 'WardMaster', FieldName)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.StatusList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onWardBedDChange(event: DropdownChangeEvent): void {
    const WardID = this.form.get('WardID')?.value;
    const StatusID = this.form.get('StatusID')?.value;

    if (WardID && StatusID >= 0) {
      this.loadWardMapping(WardID, StatusID);
    } else {
      this.WardBedDetailsMappingArray.clear();
    }
  }

  onStatusChange(event: DropdownChangeEvent): void {
    const StatusID = this.form.get('StatusID')?.value;
    const WardID = this.form.get('WardID')?.value;
    if (WardID > 0 && StatusID >= 0 ) {
      this.loadWardMapping(WardID, StatusID);
    } else {
      this.WardBedDetailsMappingArray.clear();
    }
  }

  loadWardMapping(WardID: number, StatusID: number) {
    try {
      this.pageService.WardMaster_WardBedGetDetailsAsync(WardID, StatusID)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.WardBedDetailsMappingArray.clear();
              this.WardMaster_WardBedDetailsList = response.Data.Items;
              this.WardMaster_WardBedDetailsList.forEach(() => {
                this.WardBedDetailsMappingArray.push(this.formService.createFormArrayItem(this.formConfig.WardMapping.items));
              });
              const mappedWardDetails = this.WardMaster_WardBedDetailsList.map(item => {
                return {
                  ...item,  
                  EffectiveFromDate: DateUtils.toDate(item.EffectiveFromDate), 
                  TermEndDate: DateUtils.toDate(item.TermEndDate), 
                };
              });
              this.form.patchValue({
                WardMapping: mappedWardDetails
              });
            }
            else {
              this.WardBedDetailsMappingArray.clear();
              this.alertService.showServerResponseAlert(response);
            }
          }
        });
    }
    catch (error) {

    }
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/Admin/WardMaster/Index']);
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
        this.alertService.showConfirmation({
          text: 'Do you really want to Update the Ward Bed Details?',
        }).then(result => {
          if (result.isConfirmed) {
            this.WardMaster_WardBedGetDetailsUpdateRecordAsync(this.formService.transformFormData(this.form.value));
          }
          else {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {

    }
  }

  WardMaster_WardBedGetDetailsUpdateRecordAsync(model: WardMaster_WardBedDetails): void {
    try {
      this.pageService.WardMaster_WardBedGetDetailsUpdateRecordAsync(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: "success",
                text: response.Message,
                timer: 5000
              }); 
              this.loadWardMapping(model.WardID as number, model.StatusID as number)
            }
            else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    } catch (error) {

    }
  }
}

