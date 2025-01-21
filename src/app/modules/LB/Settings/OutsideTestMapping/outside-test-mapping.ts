export interface OutsideTestMapping {
  MappingID: number | null;
  OutsideLabID: number | null;
  ServiceCategoryID: number;
  ServiceID: number | null;
  AmountToPay: number | null;
}
export interface OutsideTestMappingList {
  RowID: number;
  MappingID: number;
  OutsideLabID: number;
  OutsideLabName: string;
  ServiceCategoryName: string;
  ServiceName: string;
  AmountToPay: number;
  ActiveStatus: any;
}
