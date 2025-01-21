export interface BillCompanyMaster {
  BillCompanyID: number | null;
  BillCompanyCode: string | null;
  BillCompanyName: string | null;
  BillCompanyAddress: string | null;
  BillCompanyCity: string | null;
  BillCompanyStateID: number | null;
  BillCompanyCountryID: number | null;
  BillCompanyPinCode: string | null;
  BillCompanyPhoneNo: string | null;
  BillCompanyFaxNo: string | null;
  BillCompanyEmailID: string | null;
  BillCompanyGSTIN: string | null;
  BillCompanyPAN: string | null;
  BillCompanyTAN: string | null;
  HospitalID: string | null;
}

export interface BillCompanyMasterList {
  RowID: number;
  BillCompanyID: number;
  BillCompanyCode: string;
  BillCompanyName: string;
  BillCompanyCity: string;
  BillCompanyGSTIN: string;
  BillCompanyPAN: string;
  BillCompanyTAN: string;
  HospitalID: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}

