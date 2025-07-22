export interface LetterOfCredit {
    LCID: number | null;
    LCNo: string | null;
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    LCRefNo: string | null;
    IssuerBank: string | null;
    IssueDate: Date | null;
    LCAmountFC: number | null;
    ExchangeRateToBC: number | null;
    LCAmountBC: number | null;
    ExpiryDate: Date | null;
}

export interface LetterOfCredit_IndexTableFilter {
    LCNo: string | null;
    ExportOrderNo: string | null;
    LCRefNo: string | null;
    BankName: string | null;
}

export interface LetterOfCredit_IndexTableList {
    LCID: number;
    LCNo: string;
    ExportOrderNo: number;
    LCRefNo: string;
    BankName: string;
    IssueDate: Date | null;
    LCAmountBC: number | null;
    ExpiryDate: Date | null;
}