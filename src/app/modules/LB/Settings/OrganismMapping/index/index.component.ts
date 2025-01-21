import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PickListModule } from 'primeng/picklist';
import { Subject, takeUntil } from 'rxjs';
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormValidationService } from '../../../../../shared/services/form-validation.service';
import { FormService } from '../../../../../shared/services/form.service';
import { PageHeaderService } from '../../../../../shared/services/page-header.service';
import { AntibioticMasterList } from '../../AntibioticMater/antibiotic-master';
import { AntibioticMasterService } from '../../AntibioticMater/antibiotic-master.service';
import { OrganismMaster } from '../../OrganismMaster/organism-master';
import { OrganismMasterService } from '../../OrganismMaster/organism-master.service';
import { OrganismMapping, OrganismMappingList } from '../organism-mapping';
import { OrganismMappingService } from '../organism-mapping.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [ReactiveFormsModule, ZFormControlsModule, PickListModule, CommonModule],
  providers: [FormValidationService]
})
export class IndexComponent implements OnInit, OnDestroy {
  @ViewChild('pageHeaderActionTemplate', { static: true }) pageHeaderActionTemplate!: TemplateRef<any>;
  private destroy$ = new Subject<void>();
  isSubmitted: boolean = false;
  isItemMovedToSource: boolean = false;
  isItemMovedToTarget: boolean = false;
  form!: FormGroup;
  formConfig!: FormConfigType<OrganismMapping>;
  OrganismMapping!: OrganismMapping;
  OrganismList: OrganismMaster[] = [];
  AntibioticList: AntibioticMasterList[] = [];
  AntibioticMappedList: OrganismMappingList[] = [];

  constructor(
    private pageService: OrganismMappingService,
    private organismMasterService: OrganismMasterService,
    private antibioticService: AntibioticMasterService,
    private formService: FormService,
    private pageHeaderService: PageHeaderService,
    private alertService: AlertNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formConfig = this.pageService.getFormConfig();
    this.form = this.formService.createFormGroup<OrganismMapping>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.pageHeaderService.setTemplate(this.pageHeaderActionTemplate);
    this.loadOrganism();
    this.loadAntibiotic();
  }

  onClickPageHeaderAddButton(): void {
    this.router.navigate(['/LB/OrganismMaster/Index']);
  }

  TestList = [
    { Text: 'TRACHEAL SWAB C/S', Value: 532 },
    { Text: 'WOUND FOR CULTURE', Value: 853 }
  ];

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrganism(): void {
    try {
      this.organismMasterService.PopulateList('SelectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.OrganismList = response.Data.Items;
            }
            else {
              this.OrganismList = [];
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onOrganismChange(): void {
    this.AntibioticMappedList = [];
    const OrganismID = this.form.get('OrganismID')?.value;
    if (OrganismID) {
      this.loadMappedAntibiotic(OrganismID);
      this.form.get('TestMethodID')?.setValue(null);
      setTimeout(() => {
        this.updateMappedAntibioticCount();
      }, 200);
    } else {
      this.AntibioticMappedList = [];
      setTimeout(() => {
        this.updateMappedAntibioticCount();
      }, 200);
    }
  }

  updateMappedAntibioticCount(): void {
    const count = this.AntibioticMappedList.length;
    this.form.get('TotalMappedAntibiotic')?.patchValue(count > 0 ? count : null);
  }

  loadAntibiotic(): void {
    try {
      this.antibioticService
        .PopulateList('selectList')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.AntibioticList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  loadMappedAntibiotic(OrganismID: number): void {
    try {
      this.pageService
        .PopulateList(OrganismID, 'MappedAntibiotic')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.AntibioticMappedList = response.Data.Items;
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
        });
    } catch (error) {

    }
  }

  onMoveToTarget(event: any) {
    this.isItemMovedToTarget = event.items.length > 0;
    const OrganismID = this.form.get('OrganismID')?.value
    if (!OrganismID) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false
      }
      this.AntibioticMappedList = [];
      this.loadAntibiotic();
    }
  }

  onMoveToSource(event: any) {
    this.isItemMovedToSource = event.items && event.items.length > 0;
    if (this.isItemMovedToSource) {
      this.loadAntibiotic();
    }
  }

  onSubmit(OrgMapping: OrganismMappingList[], model: OrganismMapping): void {
    if (this.isSubmitted) return;
    this.isSubmitted = true;
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();
        this.isItemMovedToTarget = false;
        this.isSubmitted = false;
        return;
      }
      model = this.formService.processFormData(this.form.value);
      model.TestID = this.form.get('TestID')?.value;
      model.OrganismID = this.form.get('OrganismID')?.value;
      const ActionType = this.isItemMovedToSource ? 'Remove' : 'Add';
      const modelWithActionType = { ...model, ActionType };
      modelWithActionType.OrgMapping = OrgMapping;
      this.updateRecord(this.formService.transformFormData(modelWithActionType));
    }
    catch (error) {

    }
  }

  updateRecord(model: OrganismMapping): void {
    try {
      this.pageService.UpdateRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showToast({
                type: "success",
                text: response.Message,
                timer: 5000
              });
              setTimeout(() => {
                this.updateMappedAntibioticCount();
              }, 200);
              this.ReloadMappedList();
              this.updateMappedAntibioticCount();
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

  ReloadMappedList(): void {
    const OrganismID = this.form.get('OrganismID')?.value;
    if (OrganismID && this.AntibioticMappedList.length > 0) {
      this.isItemMovedToSource = false;
      this.isItemMovedToTarget = false;
      this.loadMappedAntibiotic(OrganismID);
    }
    this.form.get('OrganismID')?.setValue(null);
  }

}
