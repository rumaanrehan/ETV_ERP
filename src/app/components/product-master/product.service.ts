import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, UpdateProductList } from './product-master';
import { Validators } from '@angular/forms';
import { FormConfigType } from '../../shared/models/form.model';
import { NotOnlyWhitespaceValidator } from '../../shared/validators/not-only-whitespace.validator';
import {
  ApiDataResponse,
  ApiListResponse,
  ApiPagedListResponse,
  ApiResponse,
} from '../../shared/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://localhost:44316/api/Admin/ProductMaster';
  // tabledata = {
  //   first: 0,
  //   rows: 100,
  //   sortField: 'ProductName',
  //   sortOrder: 1,
  //   PopulateType: 'PopulateGrid',
  //   LoginID: 1,
  // };

  constructor(private http: HttpClient) {}

  PopulateList(
    CategoryID?: number,
    PopulateType?: any
  ): Observable<ApiListResponse<Product>> {
    return this.http.post<ApiListResponse<Product>>(
      `${this.apiUrl}Admin/StateMaster/PopulateList?CountryID=${CategoryID}&PopulateType=${PopulateType}`,
      {}
    );
  }

  GetDetails(productId: number): Observable<ApiDataResponse<Product>> {
    return this.http.post<ApiDataResponse<Product>>(
      `${this.apiUrl}/GetDetails?productId=${productId}`,
      {}
    );
  }

  CreateProduct(product: Product): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Create`, product);
  }

  PopulateGrid(tabledata: any): Observable<ApiPagedListResponse<Product>> {
    return this.http.post<ApiPagedListResponse<Product>>(
      `${this.apiUrl}/PopulateGrid`,
      tabledata
    );
  }

  UpdateProduct(id: any, product: UpdateProductList): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/Update`, product);
  }

  DeleteProduct(id: Product): Observable<ApiResponse> {
    const body = { ProductId: id };
    return this.http.post<ApiResponse>(`${this.apiUrl}/Delete`, body);
  }

  getFormConfig(): FormConfigType<any> {
    return {
      CategoryID: {
        label: 'Product Category',
        defaultValue: null,
        validators: [],
        validationMessages: {},
      },
      productCode: {
        label: 'Product Code',
        defaultValue: '',
        validators: [Validators.required],
        validationMessages: {
          required: 'Product Code is required.',
        },
      },
      productName: {
        label: 'Product Name',
        defaultValue: '',
        validators: [Validators.required, NotOnlyWhitespaceValidator()],
        validationMessages: {
          required: 'Product Name is required.',
        },
      },

      productDescription: {
        label: 'Product Description',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      unit: {
        label: 'Unit',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      manufacturerId: {
        label: 'Manufacturer ID',
        defaultValue: 0,
        validators: [Validators.required],
        validationMessages: {
          required: 'Manufacturer ID is required.',
        },
      },
      hsCode: {
        label: 'HS Code',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      unitPrice: {
        label: 'Unit Price',
        defaultValue: 0,
        validators: [Validators.required, Validators.min(0)],
        validationMessages: {
          required: 'Unit Price is required.',
          min: 'Unit Price cannot be negative.',
        },
      },
      costPrice: {
        label: 'Cost Price',
        defaultValue: 0,
        validators: [Validators.required, Validators.min(0)],
        validationMessages: {
          required: 'Cost Price is required.',
          min: 'Cost Price cannot be negative.',
        },
      },
      taxSlabId: {
        label: 'Tax Slab ID',
        defaultValue: 0,
        validators: [],
        validationMessages: {},
      },
      purTaxRate: {
        label: 'Purchase Tax Rate',
        defaultValue: 0,
        validators: [],
        validationMessages: {},
      },
      reorderLevel: {
        label: 'Reorder Level',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Reorder Level cannot be negative.',
        },
      },
      reorderQty: {
        label: 'Reorder Quantity',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Reorder Quantity cannot be negative.',
        },
      },
      measurementUnit: {
        label: 'Measurement Unit',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      netWeight: {
        label: 'Net Weight',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Net Weight cannot be negative.',
        },
      },
      grossWeight: {
        label: 'Gross Weight',
        defaultValue: 0,
        validators: [Validators.min(0)],
        validationMessages: {
          min: 'Gross Weight cannot be negative.',
        },
      },
      Dimension: {
        label: 'Dimension',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      packagingType: {
        label: 'Packaging Type',
        defaultValue: '',
        validators: [],
        validationMessages: {},
      },
      isActive: {
        label: 'Is Active',
        defaultValue: true,
        validators: [],
        validationMessages: {},
      },
      createdBy: {
        label: 'Created By',
        defaultValue: 'admin',
        validators: [],
        validationMessages: {},
      },
    };
  }
}
