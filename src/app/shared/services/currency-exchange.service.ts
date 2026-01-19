import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ApiDataResponse } from '../models/api-response';
import { ExchangeRateResponse, GetExchangeRateRequest } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyExchangeService {
  readonly BASE_CURRENCY = 'Indian Rupee';
  readonly BASE_CURRENCY_ISO = 'INR';
  readonly BASE_CURRENCY_SYMBOL = '₹';
  private endpoint = 'ExchangeRate';

  constructor(
    private apiService: ApiService,

  ) { }

  GetRate(model: GetExchangeRateRequest) {
    return this.apiService.post<ApiDataResponse<ExchangeRateResponse>>(`${this.endpoint}/ExchangeRate`, model);
  }

  // convertAmount(model: ConvertAmountRequest) {
  //   return this.apiService.post<ApiDataResponse<ExchangeRateResponse>>(`${this.endpoint}/AmountConversion`, model);
  // }

}
