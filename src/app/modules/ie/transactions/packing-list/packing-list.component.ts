import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AutoCompleteDef } from '../../../../shared/components/z-form-controls/z-autocomplete/z-autocomplete';
import { ZFormControlsModule } from '../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../shared/components/z-table/z-table';
import { ApiListResponse } from '../../../../shared/models/api-response';
import { FormConfigType } from '../../../../shared/models/form.model';
import { StaticList } from '../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../shared/services/form.service';
import { DateUtils } from '../../../../shared/utility/date-utils';
import { EmployeeRegistration_SelectList } from '../../../admin/transactions/employee-registration/employee-registration';
import {
  ExportOrder_SelectList,
  ExportOrderPackingList,
  ExportOrderPackingListBox,
  ExportOrderPackingListBoxDetail,
  OpenPackingDialogParams,
  ExportOrderRequest,
  ProductList
} from '../export-order/export-order';
import { ExportOrderService } from '../export-order/export-order.service';

@Component({
  selector: 'app-packing-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZFormControlsModule],
  templateUrl: './packing-list.component.html',
  styleUrl: './packing-list.component.scss'
})
export class PackingListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Output() closeDialogBoxEvent: EventEmitter<void> = new EventEmitter();
  @ViewChild('serialNoColTemplate', { static: true }) serialNoColTemplate!: TemplateRef<any>;
  @ViewChild('productSelectColTemplate', { static: true }) productSelectColTemplate!: TemplateRef<any>;
  @ViewChild('packedQtyColTemplate', { static: true }) packedQtyColTemplate!: TemplateRef<any>;
  @ViewChild('weightPerUnitColTemplate', { static: true }) weightPerUnitColTemplate!: TemplateRef<any>;
  @ViewChild('productActionColTemplate', { static: true }) productActionColTemplate!: TemplateRef<any>;

  isEditMode = false;
  isSubmitted = false;
  boxCollapsed: boolean[] = [];
  isProformaGenerated: boolean = false;

  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrderPackingList>;
  productTableDefs: TableDef<ExportOrderPackingListBoxDetail>[] = [];

  productList: ProductList[] = [];
  packingIdentityList: StaticList[] = [];
  employeeList: EmployeeRegistration_SelectList[] = [];
  exportOrderAutoCompleteDef!: AutoCompleteDef<ExportOrder_SelectList>;

  constructor(
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.formConfig = this.pageService.getPackingListFormConfig();
    this.form = this.formService.createFormGroup<ExportOrderPackingList>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);
    this.exportOrderAutoCompleteDef = this.pageService.getPackingListExportOrderAutoCompleteDef(this.formConfig, this.form);
    this.productList = [];
    this.productTableDefs = [];
    this.boxCollapsed = [];
    this.isEditMode = false;
    this.isSubmitted = false;
    this.addBox();
  }

  loadDropdownList(): void {
    this.loadStaticLists([
      { fieldName: 'PackingIdentity', targetList: 'packingIdentityList' }
    ]);

    this.pageService.GetMasterDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.employeeList = data.employeeList.Data?.Items ?? [];
        },
      });
  }

  loadStaticLists(listConfigs: { fieldName: string; targetList: keyof PackingListComponent }[]): void {
    const sources: Record<string, Observable<ApiListResponse<StaticList>>> = {};

    listConfigs.forEach(({ fieldName, targetList }) => {
      sources[targetList] = this.pageService.GetStaticList({
        AreaName: 'IE',
        ControllerName: 'ExportOrder',
        FieldName: fieldName,
      });
    });

    forkJoin(sources)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          listConfigs.forEach(({ targetList }) => {
            if (response[targetList]?.IsSuccess) {
              (this[targetList] as StaticList[]) = response[targetList].Data.Items || [];
            } else {
              (this[targetList] as StaticList[]) = [];
            }
          });
        },
      });
  }

  get boxListArray(): FormArray<FormGroup> {
    return this.form.get('BoxList') as FormArray<FormGroup>;
  }

  getProductList(boxIndex: number): FormArray<FormGroup> {
    return this.boxListArray.at(boxIndex).get('ProductList') as FormArray<FormGroup>;
  }

  loadExportOrder(event: string): void {
    const dto: ExportOrderRequest = {
      ExportOrderNo: event,
      PopulateType: 'AutoSuggestForPackingList'
    };

    this.pageService.PopulateList(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.IsSuccess) {
            this.exportOrderAutoCompleteDef.options = response.Data.Items;
          } else {
            this.exportOrderAutoCompleteDef.options = [];
            if (response.Message !== 'Record not found.') {
              this.alertService.showServerResponseAlert(response);
            }
          }
        },
      });
  }

  onSelect_ExportOrder(event: ExportOrder_SelectList): void {
    if (!event.IsProformaGenerated) {
      this.resetPackingForm();

      this.alertService.showAlert({
        type: 'warning',
        title: 'Proforma Invoice Not Generated',
        text: `Packing list can only be created for export orders with generated proforma invoice.`
      });

      return;
    }

    if (!event?.ExportOrderID) return;

    if (event.ExportOrderPackingListID) {
      this.loadPackingList(event.ExportOrderPackingListID);
      return;
    }

    this.loadExportOrderProducts(event.ExportOrderID);
  }

  onClear_ExportOrder(): void {
    this.resetPackingForm();
  }

  getAvailableProducts(boxIndex: number, rowIndex: number): ProductList[] {
    const currentProductId = this.getProductList(boxIndex).at(rowIndex).get('ProductID')?.value as number | null;
    const usedQty = new Map<number, number>();

    this.boxListArray.controls.forEach((boxControl, currentBoxIndex) => {
      const productRows = boxControl.get('ProductList') as FormArray<FormGroup>;

      productRows.controls.forEach((rowControl, currentRowIndex) => {
        if (currentBoxIndex === boxIndex && currentRowIndex === rowIndex) return;

        const productId = rowControl.get('ProductID')?.value as number | null;
        if (!productId) return;

        usedQty.set(productId, (usedQty.get(productId) || 0) + (Number(rowControl.get('PackedQty')?.value) || 0));
      });
    });

    return this.productList.filter(product =>
      product.ProductID === currentProductId ||
      (Number(product.ProuductCount) || 0) - (usedQty.get(product.ProductID) || 0) > 0
    );
  }

  createProductTableDef(boxIndex: number): TableDef<ExportOrderPackingListBoxDetail> {
    const dataWithContext = this.getProductList(boxIndex).value.map(item => ({
      ...item,
      __boxIndex: boxIndex
    })) as ExportOrderPackingListBoxDetail[];

    return {
      columnDef: [
        { data: '', label: 'S No', hideVisToggle: true, width: '5%', customTemplate: this.serialNoColTemplate },
        { data: 'ProductName', hideVisToggle: true, label: 'Product Name', width: '25%', customTemplate: this.productSelectColTemplate },
        { data: 'PackedQty', label: 'Packed Qty', width: '15%', customTemplate: this.packedQtyColTemplate },
        { data: 'WeightPerUnit', label: 'Weight Per Unit (Kg)', width: '18%', customTemplate: this.weightPerUnitColTemplate },
        { data: '', label: '', hideVisToggle: true, width: '7%', customTemplate: this.productActionColTemplate },
      ],
      data: dataWithContext
    };
  }

  addBox(): void {
    const boxForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items);
    const boxIndex = this.boxListArray.length;
    const firstProductForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items);

    boxForm.patchValue({
      ExportOrderPackingListBoxNo: (boxIndex + 1).toString()
    });

    this.boxListArray.push(boxForm);
    this.getProductList(boxIndex).push(firstProductForm);
    this.boxCollapsed[boxIndex] = false;

    this.updateProductCount(boxIndex);
    this.syncBoxMetadata();
    this.syncProductTables();
  }

  removeBox(index: number): void {
    const boxNo = this.boxListArray.at(index).get('ExportOrderPackingListBoxNo')?.value;

    this.alertService.showConfirmation({
      text: `Do you really want to remove  <b>Box ${boxNo}<b>?`
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.boxListArray.removeAt(index);
      this.boxCollapsed.splice(index, 1);

      if (this.boxListArray.length === 0) {
        this.addBox();
        return;
      }

      this.syncBoxMetadata();
      this.syncProductTables();
    });
  }

  toggleBox(boxIndex: number): void {
    this.boxCollapsed[boxIndex] = !this.boxCollapsed[boxIndex];
  }

  addProductRow(boxIndex: number): void {
    const productForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items);

    this.getProductList(boxIndex).push(productForm);
    this.updateProductCount(boxIndex);
    this.updateBoxWeight(boxIndex);
    this.syncProductTable(boxIndex);
  }

  removeProductRow(boxIndex: number, productIndex: number): void {
    const boxNo = this.boxListArray.at(boxIndex)
      .get('ExportOrderPackingListBoxNo')?.value;

    const productName = this.getProductList(boxIndex)
      .at(productIndex)
      .get('ProductName')?.value;

    const productLabel = productName ? `Product ${productName}` : 'this row';

    this.alertService.showConfirmation({
      text: `Do you really want to remove <b>${productLabel}</b> from <b>Box ${boxNo}</b>?`
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.getProductList(boxIndex).removeAt(productIndex);

      if (this.getProductList(boxIndex).length === 0) {
        this.addProductRow(boxIndex);
        return;
      }

      this.updateProductCount(boxIndex);
      this.updateBoxWeight(boxIndex);
      this.syncProductTable(boxIndex);
    });
  }

  onChange_Product(productId: number | null, boxIndex: number, rowIndex: number): void {
    const row = this.getProductList(boxIndex).at(rowIndex) as FormGroup;

    if (!productId) {
      row.patchValue({ ProductID: null, ProductName: null, PackedQty: null });
      this.updateBoxWeight(boxIndex);
      this.syncProductTables();
      return;
    }

    if (this.isProductDuplicateInBox(productId, boxIndex, rowIndex)) {
      this.alertService.showToast({ text: 'Product already exists' });
      row.patchValue({ ProductID: null, ProductName: null, PackedQty: null });
      this.updateBoxWeight(boxIndex);
      this.syncProductTables();
      return;
    }

    const selectedProduct = this.productList.find(product => product.ProductID === productId);
    const availableQty = selectedProduct?.ProuductCount ?? 0;
    const usedQtyInOtherRows = this.getUsedQtyForProduct(productId, boxIndex, rowIndex);
    const remainingQty = Math.max(availableQty - usedQtyInOtherRows, 0);

    row.patchValue({
      ProductID: productId,
      ProductName: selectedProduct?.ProductName ?? null,
      PackedQty: remainingQty
    });

    this.updateBoxWeight(boxIndex);
    this.syncProductTables();
  }

  onChange_PackedQty(boxIndex: number, rowIndex: number): void {    
    this.updateBoxWeight(boxIndex);
    
    const currentRow = this.getProductList(boxIndex).at(rowIndex) as FormGroup;
    const productId = currentRow.get('ProductID')?.value as number | null;

    if (!productId) return;

    const qtyInOtherRows = this.getUsedQtyForProduct(productId, boxIndex, rowIndex);
    const currentQty = Number(currentRow.get('PackedQty')?.value) || 0;
    const availableQty = this.productList.find(product => product.ProductID === productId)?.ProuductCount ?? 0;
    const totalQty = qtyInOtherRows + currentQty;

    if (totalQty > availableQty) {
      currentRow.patchValue({ PackedQty: availableQty }, { emitEvent: false });
      this.updateBoxWeight(boxIndex);
      this.syncProductTables();

      this.alertService.showAlert({
        type: 'warning',
        title: 'Quantity Exceeded',
        text: `Total packed quantity (${totalQty}) exceeds available quantity (${availableQty})`
      });
      return;
    }

    this.syncProductTables();
  }

  onChange_WeightPerUnit(boxIndex: number): void {
    this.updateBoxWeight(boxIndex);
  }

  updateProductCount(boxIndex: number): void {
    this.boxListArray.at(boxIndex).patchValue({
      NoOfProduct: this.getProductList(boxIndex).length
    });
  }

  updateBoxWeight(boxIndex: number): void {
    debugger;
    const totalWeight = this.getProductList(boxIndex).controls.reduce((total, rowControl) => {
      const packedQty = Number(rowControl.get('PackedQty')?.value) || 0;
      const weightPerUnit = Number(rowControl.get('WeightPerUnit')?.value) || 0;

      return total + (packedQty * weightPerUnit);
    }, 0);

    this.boxListArray.at(boxIndex).patchValue({
      BoxWeight: totalWeight > 0 ? Number(totalWeight.toFixed(2)) : null
    }, { emitEvent: false });
  }

  updateBoxNumbers(): void {
    this.boxListArray.controls.forEach((boxControl, index) => {
      boxControl.patchValue({
        ExportOrderPackingListBoxNo: (index + 1).toString()
      }, { emitEvent: false });
    });
  }

  updateBoxCount(): void {
    this.form.patchValue({
      NoOfBox: this.boxListArray.length
    }, { emitEvent: false });
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

      if (!this.validatePackedProductCount()) {
        this.isSubmitted = false;
        return;
      }

      if (this.isEditMode) {
        this.alertService.showConfirmationWithInput({
          text: 'Do you really want to Update?',
        }).then((result) => {
          if (result.isConfirmed) {
            const model: ExportOrderPackingList = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(this.formService.transformFormData(model));
          } else {
            this.isSubmitted = false;
          }
        });
        return;
      }

      this.createRecord(this.formService.transformFormData(this.form.value));
    }
    catch (error) {
      this.isSubmitted = false;
    }
  }

  createRecord(model: ExportOrderPackingList): void {
    try {
      this.pageService.CreatePackingRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
              this.closeDialogBox();
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {
      this.isSubmitted = false;
    }
  }

  updateRecord(model: ExportOrderPackingList): void {
    try {
      this.pageService.UpdatePackingRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.alertService.showAlert({
                type: 'success',
                text: response.Message,
                timer: 5000
              });
              this.closeDialogBox();
            } else {
              this.alertService.showServerResponseAlert(response);
            }
          },
          complete: () => {
            this.isSubmitted = false;
          }
        });
    }
    catch (error) {
      this.isSubmitted = false;
    }
  }

  closeDialogBox(): void {
    this.resetPackingForm();
    setTimeout(() => this.closeDialogBoxEvent.emit(), 1);
  }

  openDialogBox(params: OpenPackingDialogParams): void {
    this.resetPackingForm();
    this.isEditMode = params.isEditMode;

    if (params.productList) {
      this.form.patchValue(params.productList);
      this.productList = params.productList.ProductList?.Items?.map(item => ({
        ProductID: item.ProductID,
        ProductCode: item.ProductCode,
        ProductName: item.ProductName,
        ProuductCount: item.SalesQty
      })) ?? [];
      this.syncBoxMetadata();
      this.syncProductTables();
      return;
    }

    if (params.packingList) {
      this.form.patchValue(this.mapPackingListHeader(params.packingList));
      this.buildBoxes(params.packingList.BoxList ?? []);
      this.productList = this.buildPackedProductList(params.packingList.BoxList ?? []);
      this.syncBoxMetadata();
      this.syncProductTables();
    }
  }

  validatePackedProductCount(): boolean {
    const expectedProductQty = new Map<number, number>();
    this.productList.forEach(product => {
      expectedProductQty.set(product.ProductID, Number(product.ProuductCount) || 0);
    });

    const packedProductQty = new Map<number, number>();
    this.boxListArray.controls.forEach((boxControl) => {
      const productRows = boxControl.get('ProductList') as FormArray<FormGroup>;

      productRows.controls.forEach((rowControl) => {
        const productId = rowControl.get('ProductID')?.value as number | null;
        if (!productId) return;

        const packedQty = Number(rowControl.get('PackedQty')?.value) || 0;
        packedProductQty.set(productId, (packedProductQty.get(productId) || 0) + packedQty);
      });
    });

    const mismatchProducts: string[] = [];
    expectedProductQty.forEach((expectedQty, productId) => {
      const packedQty = packedProductQty.get(productId) || 0;
      if (packedQty !== expectedQty) {
        const productName = this.productList.find(product => product.ProductID === productId)?.ProductName ?? `Product ID ${productId}`;
        mismatchProducts.push(`${productName}: packed ${packedQty}, expected ${expectedQty}`);
      }
    });

    const unexpectedProducts: string[] = [];
    packedProductQty.forEach((_, productId) => {
      if (!expectedProductQty.has(productId)) {
        const productName = this.productList.find(product => product.ProductID === productId)?.ProductName ?? `Product ID ${productId}`;
        unexpectedProducts.push(productName);
      }
    });

    if (mismatchProducts.length || unexpectedProducts.length) {
      const detailText = [
        mismatchProducts.length ? `Mismatched count: ${mismatchProducts.join(', ')}` : null,
        unexpectedProducts.length ? `Unexpected products: ${unexpectedProducts.join(', ')}` : null
      ].filter(Boolean).join(' | ');

      this.alertService.showAlert({
        type: 'warning',
        title: 'Packing Validation Failed',
        text: detailText || 'All records in box list must exactly match product counts.'
      });
      return false;
    }

    return true;
  }

  private loadPackingList(packingListID: number): void {
    this.pageService.GetPackingListDetails(packingListID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.IsSuccess) {
            this.alertService.showServerResponseAlert(response);
            return;
          }

          this.isEditMode = true;
          this.form.patchValue(this.mapPackingListHeader(response.Data));
          this.buildBoxes(response.Data.BoxList ?? []);
          this.productList = this.buildPackedProductList(response.Data.BoxList ?? []);
          this.syncBoxMetadata();
          this.syncProductTables();
        }
      });
  }

  private loadExportOrderProducts(exportOrderID: number): void {
    this.pageService.GetExportOrderProductDetails(exportOrderID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.IsSuccess) {
            this.alertService.showServerResponseAlert(response);
            return;
          }

          this.isEditMode = false;
          this.form.patchValue(response.Data);
          this.productList = response.Data.ProductList?.Items?.map(item => ({
            ProductID: item.ProductID,
            ProductCode: item.ProductCode,
            ProductName: item.ProductName,
            ProuductCount: item.SalesQty
          })) ?? [];

          this.syncBoxMetadata();
          this.syncProductTables();
        }
      });
  }

  private mapPackingListHeader(packingList: ExportOrderPackingList): Partial<ExportOrderPackingList> {
    const { BoxList, ...packingListHeader } = packingList;
    return packingListHeader;
  }

  private buildBoxes(boxes: ExportOrderPackingListBox[]): void {
    this.boxListArray.clear();
    this.boxCollapsed = [];

    boxes.forEach((box, index) => {
      const boxForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items);
      const productArray = boxForm.get('ProductList') as FormArray<FormGroup>;

      boxForm.patchValue({
        ...box,
        PackedDateTime: this.toDate(box.PackedDateTime),
        InspectedDateTime: this.toDate(box.InspectedDateTime),
        NoOfProduct: box.NoOfProduct
      });

      productArray.clear();
      (box.ProductList ?? []).forEach((product) => {
        const productForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items);
        productForm.patchValue(product);
        productArray.push(productForm);
      });

      if (productArray.length === 0) {
        productArray.push(this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items));
      }

      this.boxListArray.push(boxForm);
      this.boxCollapsed[index] = false;
    });

    if (this.boxListArray.length === 0) {
      this.addBox();
    }
  }

  private buildPackedProductList(boxes: ExportOrderPackingListBox[]): ProductList[] {
    const productQtyMap = new Map<number, ProductList>();

    boxes.forEach((box) => {
      (box.ProductList ?? []).forEach((product) => {
        if (product.ProductID == null || !product.ProductName) return;

        const packedQty = Number(product.PackedQty) || 0;
        const existingProduct = productQtyMap.get(product.ProductID);

        if (existingProduct) {
          existingProduct.ProuductCount += packedQty;
          return;
        }

        productQtyMap.set(product.ProductID, {
          ProductID: product.ProductID,
          ProductCode: product.ProductCode!,
          ProductName: product.ProductName,
          ProuductCount: packedQty
        });
      });
    });

    return Array.from(productQtyMap.values());
  }

  private getUsedQtyForProduct(productId: number, boxIndex: number, rowIndex: number): number {
    return this.boxListArray.controls.reduce((total, boxControl, currentBoxIndex) => {
      const productRows = boxControl.get('ProductList') as FormArray<FormGroup>;

      return total + productRows.controls.reduce((boxTotal, rowControl, currentRowIndex) => {
        if (currentBoxIndex === boxIndex && currentRowIndex === rowIndex) return boxTotal;

        return boxTotal + (
          rowControl.get('ProductID')?.value === productId
            ? (Number(rowControl.get('PackedQty')?.value) || 0)
            : 0
        );
      }, 0);
    }, 0);
  }

  private isProductDuplicateInBox(productId: number, boxIndex: number, currentRow: number): boolean {
    return this.getProductList(boxIndex).controls.some((productControl, productIndex) => {
      if (productIndex === currentRow) return false;
      return productControl.get('ProductID')?.value === productId;
    });
  }

  private syncBoxMetadata(): void {
    this.updateBoxNumbers();
    this.updateBoxCount();

    this.boxListArray.controls.forEach((_, index) => {
      this.updateProductCount(index);
      this.updateBoxWeight(index);
    });
  }

  private syncProductTable(boxIndex: number): void {
    this.productTableDefs[boxIndex] = this.createProductTableDef(boxIndex);
  }

  private syncProductTables(): void {
    this.productTableDefs = this.boxListArray.controls.map((_, index) => this.createProductTableDef(index));
    this.boxCollapsed = this.boxListArray.controls.map((_, index) => this.boxCollapsed[index] ?? false);
  }

  private resetPackingForm(): void {
    this.formService.resetFormValue<ExportOrderPackingList>(this.formConfig, this.form);
    this.boxListArray.clear();
    this.productList = [];
    this.productTableDefs = [];
    this.boxCollapsed = [];
    this.isEditMode = false;
    this.isSubmitted = false;
    this.exportOrderAutoCompleteDef.options = [];
    this.addBox();
  }

  private toDate(value: Date | string | null | undefined): Date | null {
    return value ? DateUtils.toDate(value as Date) : null;
  }
}
