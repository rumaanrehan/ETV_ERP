export interface HolidayMaster {
  HolidayID: number | null;
  HolidayCode: string | null;
  HolidayName: string | null;
  HolidayTypeID: number | null;
  HolidayDate: Date | null;
  HolidayDescriptions: string | null;
}
export interface HolidayMasterList {
  RowID: number;
  HolidayID: number;
  HolidayCode: string;
  HolidayName: string;
  HolidayYear: string;
  HolidayTypeID: number;
  HolidayTypeName: string;
  HolidayDate: Date;
  HolidayDescriptions: string;
  ActiveStatus: any;
}
