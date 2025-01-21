export interface MusheerKhalid {
    HolidayID: number | null;
    HolidayCode: string | null;
    HolidayName: string | null;
    HolidayTypeID: number | null;
    HolidayDate: Date | null;
    HolidayDescriptions: string | null;
    selectedCategory: string | null;
    checkbox: boolean;
    Switch: boolean;
    InputNumber: number | null;
  }
  export interface MusheerKhalidList {
    RowID: number;
    HolidayID: number;
    HolidayCode: string;
    HolidayName: string;
    HolidayYear: string;
    HolidayTypeID: number;
    HolidayTypeName: string;
    HolidayDate: Date;
    HolidayDescriptions: string;
    ActiveStatus: boolean;
  }