export interface LetterOfCredit {
    LCID: number | null;
    LCNo: string | null;
    ExportOrderID: number | null;
    LCDate: Date | null;
    IssuerBankID: string | null;
    LCAmountFC: number | null;
    ExpiryDate: Date | null;
}

export interface LetterOfCredit_IndexTableList {
    LCID: number | null;
    LCNo: string | null;
    LCDate: Date | null;
    IssuerBankID: string | null;
    LCAmountFC: number | null;
    ExpiryDate: Date | null;
}

export interface LetterOfCredit_IndexTableFilter {
    LCNo: string | null;
}