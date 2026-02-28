import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { FormDialogComponent } from "../../../../../shared/components/form-dialog/form-dialog.component";
import { ZFormControlsModule } from '../../../../../shared/components/z-form-controls/z-form-controls.module';
import { TableDef } from '../../../../../shared/components/z-table/z-table';
import { FormConfigType } from '../../../../../shared/models/form.model';
import { StaticList } from '../../../../../shared/models/select-list';
import { AlertNotificationService } from '../../../../../shared/services/alert-notification.service';
import { FormService } from '../../../../../shared/services/form.service';
import { DateUtils } from '../../../../../shared/utility/date-utils';
import { ExportOrderPackingList, ExportOrderPackingListBox, ExportOrderPackingListBoxDetail, OpenPackingDialogParams, ProductList } from '../export-order';
import { ExportOrderService } from '../export-order.service';
import { ApiListResponse } from '../../../../../shared/models/api-response';
import { EmployeeRegistration_SelectList } from '../../../../admin/transactions/employee-registration/employee-registration';

@Component({
  selector: 'app-packing-list',
  standalone: true,
  imports: [CommonModule, FormDialogComponent, FormDialogComponent, ReactiveFormsModule, ZFormControlsModule],
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

  isFormDialogVisible: boolean = false;
  isEditMode: boolean = false;
  isSubmitted: boolean = false;
  boxCollapsed: boolean[] = [];

  form!: FormGroup;
  formConfig!: FormConfigType<ExportOrderPackingList>;
  tableDef!: TableDef<ExportOrderPackingListBox>;
  productTableDefs: TableDef<ExportOrderPackingListBoxDetail>[] = [];

  productList: ProductList[] = [];
  packingIdentityList: StaticList[] = [];
  employeeList: EmployeeRegistration_SelectList[] = [];

  // Autocomplete replaced with z-select dropdown in product table.
  // productAutoCompleteDef: AutoCompleteDef<Product_SelectList>[][] = [];
  
  constructor(
    private pageService: ExportOrderService,
    private formService: FormService,
    private alertService: AlertNotificationService
  ) { }
  
  ngOnInit(): void {
    this.formConfig = this.pageService.getPackingListFormConfig();
    this.form = this.formService.createFormGroup<ExportOrderPackingList>(this.formConfig);
    this.formService.initializeFormValidationMessage(this.formConfig, this.form);

    // this.productTableDefs = [];
    this.addBox();
    this.loadDropdownList();
  }/*  */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
            const targetResponse = response?.[targetList];
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

  getAvailableProducts(boxIndex: number, rowIndex: number): ProductList[] {
    const currentProductId = this.getProductList(boxIndex).at(rowIndex).get('ProductID')?.value as number | null;
    const usedQty = new Map<number, number>();

    this.boxListArray.controls.forEach((box, b) =>
      ((box.get('ProductList') as FormArray<FormGroup>).controls).forEach((row, r) => {
        if (b === boxIndex && r === rowIndex) return;
        const productId = row.get('ProductID')?.value as number | null;
        if (!productId) return;
        usedQty.set(productId, (usedQty.get(productId) || 0) + (Number(row.get('PackedQty')?.value) || 0));
      })
    );

    return this.productList.filter(p =>
      p.ProductID === currentProductId || (Number(p.ProuductCount) || 0) - (usedQty.get(p.ProductID) || 0) > 0
    );
  }

  createProductTableDef(boxIndex: number): TableDef<ExportOrderPackingListBoxDetail> {
    const dataWithContext = this.getProductList(boxIndex).value.map((item) => ({ ...item, __boxIndex: boxIndex })) as ExportOrderPackingListBoxDetail[];
    return {
      columnDef: [
        { data: "", label: "S No", hideVisToggle: true, width: "5%", customTemplate: this.serialNoColTemplate },
        { data: "ProductName", hideVisToggle: true, label: "Product Name", width: "45%", customTemplate: this.productSelectColTemplate },
        { data: "PackedQty", label: "Packed Qty", width: "20%", customTemplate: this.packedQtyColTemplate },
        { data: "WeightPerUnit", label: "Weight Per Unit (Kg)", width: "20%", customTemplate: this.weightPerUnitColTemplate },
        { data: "", label: "", hideVisToggle: true, width: "8%", customTemplate: this.productActionColTemplate },
      ],
      data: dataWithContext
    };
  }

  // Autocomplete handlers are kept commented as requested.
  // onSearch_Product(event: string, boxIndex: number, rowIndex: number): void {}
  // onSelect_Product(event: Product_SelectList, boxIndex: number, rowIndex: number): void {}
  // onClear_Product(boxIndex: number, rowIndex: number): void {}

  onChange_Product(productId: number | null, boxIndex: number, rowIndex: number): void {
    const row = this.getProductList(boxIndex).at(rowIndex) as FormGroup;

    if (!productId) {
      row.patchValue({ ProductID: null, ProductName: null, PackedQty: null });
      this.refreshTable();
      return;
    }

    // Duplicate check (only inside current box)
    if (this.isProductDuplicateInBox(productId, boxIndex, rowIndex)) {
      this.alertService.showToast({text: 'Product already exists'});

      row.patchValue({ ProductID: null, ProductName: null, PackedQty: null });
      return;
    }

    const selectedProduct = this.productList.find(p => p.ProductID === productId);
    const availableQty = selectedProduct?.ProuductCount ?? 0;
    const usedQtyInOtherRows = this.boxListArray.controls.reduce((total, boxControl, bIndex) => {
      const productRows = boxControl.get('ProductList') as FormArray;
      return total + productRows.controls.reduce((boxTotal, rowControl, rIndex) => {
        if (bIndex === boxIndex && rIndex === rowIndex) return boxTotal;
        return boxTotal + (rowControl.get('ProductID')?.value === productId ? (Number(rowControl.get('PackedQty')?.value) || 0) : 0);
      }, 0);
    }, 0);
    const remainingQty = Math.max(availableQty - usedQtyInOtherRows, 0);

    row.patchValue({
      ProductID: productId,
      ProductName: selectedProduct!.ProductName,
      PackedQty: remainingQty
    });

    this.refreshTable();
  }

  addBox(): void {
    const boxForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items);
    boxForm.patchValue({ExportOrderPackingListBoxNo: (this.boxListArray.length + 1).toString()});

    //Push the new box form to the FormArray
    this.boxListArray.push(boxForm);

    const boxIndex = this.boxListArray.length - 1;
    this.boxCollapsed[boxIndex] = false;

    // Initialize the product AutoCompleteDef array for the new box
    this.productTableDefs[boxIndex] = this.createProductTableDef(boxIndex);

    const firstProductForm = this.formService.createFormArrayItem( this.formConfig.BoxList.items.ProductList.items);

    this.getProductList(boxIndex).push(firstProductForm);

    this.updateProductCount(boxIndex);

    this.productTableDefs[boxIndex] = this.createProductTableDef(boxIndex);

    this.updateBoxNumbers();
    this.updateBoxCount();
    this.refreshTable();
  }

  removeBox(index: number): void {
    const boxControl = this.boxListArray.at(index);
    const BoxNo = boxControl.get('ExportOrderPackingListBoxNo')?.value;

    this.alertService.showConfirmation({text: `Do you really want to remove  <b>Box ${BoxNo}<b>?`})
      .then(result => {
        if (!result.isConfirmed) return;

        this.boxListArray.removeAt(index);
        this.productTableDefs.splice(index, 1);
        this.boxCollapsed.splice(index, 1);

        if (this.boxListArray.length === 0) {
          this.addBox();
          return;
        }

        this.rebuildProductTableDefs();
        this.updateBoxNumbers();
        this.updateBoxCount();
      });
  }

  rebuildProductTableDefs(): void {
    this.productTableDefs = this.boxListArray.controls.map(
      (_, i) => this.createProductTableDef(i)
    );
    this.syncBoxCollapseState();
  }

  // Autocomplete rebuilt logic is commented because product selection now uses z-select.
  // rebuildProductAutoCompleteDefs(): void {}

  syncBoxCollapseState(): void {
    this.boxCollapsed = this.boxListArray.controls.map((_, i) => this.boxCollapsed[i] ?? false);
  }

  toggleBox(boxIndex: number): void {
    this.boxCollapsed[boxIndex] = !this.boxCollapsed[boxIndex];
  }

  updateBoxCount(): void {
    this.form.patchValue({NoOfBox: this.boxListArray.length});
  }

  updateBoxNumbers(): void {
    this.boxListArray.controls.forEach((boxControl, index) => {
      boxControl.patchValue({
        ExportOrderPackingListBoxNo: (index + 1).toString()
      }, { emitEvent: false });
    });
  }

  addProductRow(boxIndex: number): void {
    const productForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items);

    this.getProductList(boxIndex).push(productForm);

    this.updateProductCount(boxIndex);

    this.productTableDefs[boxIndex] = this.createProductTableDef(boxIndex);

    this.refreshTable();
  }

  removeProductRow(boxIndex: number, productIndex: number): void {
    const boxControl = this.boxListArray.at(boxIndex);
    const BoxNo = boxControl.get('ExportOrderPackingListBoxNo')?.value;
    const productForm = this.getProductList(boxIndex).at(productIndex) as FormGroup;
    const productName = productForm.get("ProductName")?.value;

    this.alertService.showConfirmation({text: `Do you really want to remove  <b>Product ${productName} from Box ${BoxNo}<b>?`})
      .then(result => {
        if (!result.isConfirmed) return;


        this.getProductList(boxIndex).removeAt(productIndex);

        if (this.getProductList(boxIndex).length === 0) {
          this.addProductRow(boxIndex);
          return;
        }

        this.updateProductCount(boxIndex);
        this.productTableDefs[boxIndex] = this.createProductTableDef(boxIndex);
        this.refreshTable();
      });
  }

  onClickRemoveProductItem(boxIndex: number, productIndex: number): void {
    const row = this.getProductList(boxIndex).at(productIndex) as FormGroup;
    const productName = row.get("ProductName")?.value
    if (productName !== null) {
      this.alertService.showConfirmation({
        text: `Do you really want to remove <b>${productName}<b>?`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeProductRow(boxIndex, productIndex);
        }
      });
    }
    else {this.removeProductRow(boxIndex, productIndex)
    }
  }

  updateProductCount(boxIndex: number): void {
    const count = this.getProductList(boxIndex).length;

    this.boxListArray.at(boxIndex).patchValue({
      NoOfProduct: count
    });
  }

  onChange_PackedQty(boxIndex: number, rowIndex: number): void {
    const boxes = this.form.get('BoxList') as FormArray;

    const currentRow = ((boxes.at(boxIndex) as FormGroup).get('ProductList') as FormArray).at(rowIndex) as FormGroup;

    const productId = currentRow.get('ProductID')?.value;

    if (!productId) return;
    const qtyInOtherRows = boxes.controls.reduce((total, boxControl, bIndex) => {
      const boxRows = boxControl.get('ProductList') as FormArray;
      return total + boxRows.controls.reduce((boxTotal, rowControl, rIndex) => {
        if (bIndex === boxIndex && rIndex === rowIndex) return boxTotal;
        return boxTotal + (rowControl.get('ProductID')?.value === productId ? (Number(rowControl.get('PackedQty')?.value) || 0) : 0);
      }, 0);
    }, 0);
    const currentQty = Number(currentRow.get('PackedQty')?.value) || 0;
    const totalQty = qtyInOtherRows + currentQty;

    const product = this.productList.find(p => p.ProductID === productId);

    const availableQty = product?.ProuductCount ?? 0;

    if (totalQty > availableQty) {
      currentRow.patchValue({PackedQty: availableQty}, { emitEvent: false });
      this.refreshTable();

      this.alertService.showAlert({
        type: "warning",
        title: 'Quantity Exceeded',
        text: `Total packed quantity (${totalQty}) exceeds available quantity (${availableQty})`
      });
    }
  }

  isProductDuplicateInBox(productId: number, boxIndex: number, currentRow: number): boolean {
    const products = this.getProductList(boxIndex);

    return products.controls.some((prod, pIndex) => {
      if (pIndex === currentRow) {
        return false;
      }

      return prod.value.ProductID === productId;
    });
  }

  refreshTable(): void {
    this.tableDef = {...this.tableDef, data: this.boxListArray.value};
  }

  openDialogBox(params: OpenPackingDialogParams): void {
    const { isEditMode, productList, packingList } = params;
    this.isEditMode = isEditMode;

    if (productList) {
      this.form.patchValue(productList);
      this.productList = productList.ProductList?.Items?.map(e => ({
        ProductID: e.ProductID,
        ProductCode: e.ProductCode,
        ProductName: e.ProductName,
        ProuductCount: e.SalesQty
      })) ?? [];
    } else if (packingList) {
      const { BoxList = [], ...packingListDetail } = packingList;
      this.form.patchValue(packingListDetail);

      const boxArray = this.form.get('BoxList') as FormArray<FormGroup>;
      boxArray.clear();

      const productQtyMap = new Map<number, ProductList>();
      BoxList.forEach((box) => {
        const boxForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items);
        boxForm.patchValue({...box, PackedDateTime: this.formatDate(box.PackedDateTime!), InspectedDateTime: this.formatDate(box.InspectedDateTime!), NoOfProduct: box.NoOfProduct});

        const productArray = boxForm.get('ProductList') as FormArray<FormGroup>;
        productArray.clear();

        (box.ProductList ?? []).forEach((product) => {
          const productForm = this.formService.createFormArrayItem(this.formConfig.BoxList.items.ProductList.items);
          productForm.patchValue(product);
          productArray.push(productForm);

          if (product.ProductID == null || !product.ProductName) return;
          const packedQty = Number(product.PackedQty) || 0;
          const existing = productQtyMap.get(product.ProductID);
          if (existing) {
            existing.ProuductCount += packedQty;
          } else {
            productQtyMap.set(product.ProductID, {
              ProductID: product.ProductID,
              ProductCode:  product.ProductCode!,
              ProductName: product.ProductName,
              ProuductCount: packedQty
            });
          }
        });

        boxArray.push(boxForm);
      });

      this.productList = Array.from(productQtyMap.values());
      this.productTableDefs = this.boxListArray.controls.map((_, index) => this.createProductTableDef(index));
      this.updateBoxCount();
    }

    this.isFormDialogVisible = true;

    // Wait for form array to build
    setTimeout(() => {
      this.rebuildProductTableDefs();
      this.syncBoxCollapseState();
      this.updateBoxNumbers();
      this.refreshTable();
      this.updateBoxCount();
    });
  }

  closeDialogBox(): void {
    this.isFormDialogVisible = false;
    this.isEditMode = false;
    (this.form.get('Boxes') as FormArray)?.controls.forEach(b => (b.get('ProductList') as FormArray)?.clear());
    (this.form.get('Boxes') as FormArray)?.clear();
    this.form.reset();
    this.formService.resetFormValue<ExportOrderPackingList>(this.formConfig, this.form);

    setTimeout(() => this.closeDialogBoxEvent.emit(), 1);
  }
  
  onSubmit(): void {
    if (this.isSubmitted) return;

    this.isSubmitted = true;
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.formService.validateFormFields(this.formConfig, this.form);
        this.alertService.showValidationAlert();        
        this.logInvalidControls(this.form);
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
        }).then(result => {
          if (result.isConfirmed) {
            const model: ExportOrderPackingList = {
              ...this.formService.transformFormData(this.form.value),
              ReasonToUpdate: result.value
            };
            this.updateRecord(this.formService.transformFormData(model));
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

  createRecord(model: ExportOrderPackingList): void {
    try {
      this.pageService.CreatePackingRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeDialogBox();
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

  updateRecord(model: ExportOrderPackingList): void {
    try {
      this.pageService.UpdatePackingRecord(model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.IsSuccess) {
              this.closeDialogBox();
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

  validatePackedProductCount(): boolean {
    const expectedProductQty = new Map<number, number>();
    this.productList.forEach(product => {expectedProductQty.set(product.ProductID, Number(product.ProuductCount) || 0);});

    const packedProductQty = new Map<number, number>();
    this.boxListArray.controls.forEach((boxControl) => {
      const rows = boxControl.get('ProductList') as FormArray<FormGroup>;
      rows.controls.forEach((rowControl) => {
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
        const productName = this.productList.find(p => p.ProductID === productId)!.ProductName;
        mismatchProducts.push(`${productName}: packed ${packedQty}, expected ${expectedQty} \n`);
      }
    });

    const unexpectedProducts: string[] = [];
    packedProductQty.forEach((_, productId) => {
      if (!expectedProductQty.has(productId)) {
        const productName = this.productList.find(p => p.ProductID === productId)?.ProductName ?? `Product ID ${productId}`;
        unexpectedProducts.push(productName);
      }
    });

    if (mismatchProducts.length || unexpectedProducts.length) {
      const detailText = [
        mismatchProducts.length ? `Mismatched count: ${mismatchProducts.join(', ')}` : null,
        unexpectedProducts.length ? `Unexpected products: ${unexpectedProducts.join(', ')}` : null
      ].filter(Boolean).join(' | ');

      this.alertService.showAlert({
        type: "warning",
        title: 'Packing Validation Failed',
        text: detailText || 'All records in box list must exactly match product counts.'
      });
      return false;
    }

    return true;
  }

  formatDate(date: Date) {
    return DateUtils.toDate(date);
  }

  private logInvalidControls(form: FormGroup | FormArray, parentKey: string = ''): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      const controlPath = parentKey ? `${parentKey}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control, controlPath);
      } else if (control && control.invalid) {
        console.warn(
          `❌ Invalid Control: ${controlPath}`,
          control.errors
        );
      }
    });
  }
}




