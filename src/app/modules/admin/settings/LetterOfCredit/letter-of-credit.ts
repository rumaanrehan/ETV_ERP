import { ExportOrder } from "../ExportOrder/export-order";

export interface LetterOfCredit {
    LCID: number | null;
    LCNo: string | null;
    ExportOrders: ExportOrder[] | null;
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