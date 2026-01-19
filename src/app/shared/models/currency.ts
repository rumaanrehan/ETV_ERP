export interface GetExchangeRateRequest {
    FromCurrencyCode?: string;
    ToCurrencyCode: string;
    CurrencyID: number;
}

export interface ConvertAmountRequest extends GetExchangeRateRequest {
    Amount: number;
}

export interface ExchangeRateResponse {
    Result: string;
    Documentation: string;
    Terms_Of_Use: string;

    Time_Last_Update_Unix: number;
    Time_Last_Update_Utc: string;

    Time_Next_Update_Unix: number;
    Time_Next_Update_Utc: string;

    Base_Code: string;
    Target_Code: string;

    Conversion_Rate: number;
    Conversion_Result: number | null;

    Error_Type: string;
}
