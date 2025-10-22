export interface HolidayMaster {
  HolidayID: number | null;
  HolidayCode: string | null;
  HolidayName: string | null;
  HolidayTypeID: number | null;
  HolidayDate: Date | null;
  HolidayDescription: string | null;
}

export interface Holiday_SelectList {
  HolidayID: number;
  HolidayName: string;
}

export interface Holiday_IndexTableFilter {
  HolidayCode: string | null;
  HolidayName: string | null;
  HolidayYear: number | null;
  ActiveStatusID: number | null;
}

export interface Holiday_IndexTableList {
  RowID: number;
  HolidayID: number;
  HolidayCode: string;
  HolidayName: string;
  HolidayYear: string;
  HolidayTypeName: string;
  HolidayDate: Date;
  HolidayDescription: string;
  ActiveStatus: boolean;
}

export interface HolidayRequest{
  HolidayName?: string | null;
  HolidayTypeID?: number | null;
  PopulateType: string | null
}

export interface HolidayDetails {
  HolidayID?: number | null;
  HolidayCode: string | null;
  HolidayName: string;
  HolidayTypeID: number | null;
  HolidayDate: Date | null;
  HolidayDescription: string | null;
}






