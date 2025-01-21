export interface WardMaster {
  WardID: number | null;
  WardName: string | null;
  WardCode: string | null;
  ShortCode: string | null;
  FloorNo: string | null;
  BlockName: string | null;
  RoomTypeID: number | null;
  WardType: number | null;
  AllowedForGender: number | null;
  TotalBeds: number | null;
  EffectiveFromDate: Date | null;
  TermEndDate: Date | null;
  DisplayOrder: number | null;
}
export interface WardMasterList {
  RowID: number;
  WardID: number;
  WardCode: string;
  WardName: string;
  ShortCode: string;
  FloorNo: string;
  BlockName: string;
  RoomTypeName: string;
  WardType: string;
  AllowedForGender: string;
  TotalBeds: number;
  DisplayOrder: number;
  ActiveStatus: boolean;
}
export class WardMaster_AddWardBed {
  WardBed_WardID: number | null = null;
  WardBed_TotalBeds: number | null = null;
  WardBed_EffectiveFromDate: Date | null = null;
}
export interface WardMaster_WardBedDetails {
  WardID: number | null;
  StatusID: number | null;
  WardMapping: WardMaster_WardBedDetailsList[];
}
export interface WardMaster_WardBedDetailsList {
  WardBedID: number | null;
  BedNo: string | null;
  IsIncludedInBOR: boolean | true;
  EffectiveFromDate: Date | null;
  TermEndDate: Date | null;
}
export interface WardMaster_WardBedUnitMapping {
  WardID: number | null;
  DepartmentID: number | null;
  ConsultantUnitID: number | null;
  FromBedNo: number | null;
  ToBedNo: number | null;
  EffectiveFromDate: Date | null;
  TermEndDate: Date | null;
  ViewBy: number | null;
  StatusID: number | null;
  KeepOpenWardBedUnitMappingModal: boolean | null;
  WardBedUnitMapping: WardMaster_WardBedUnitMappingList[];
}
export interface WardMaster_WardBedUnitMappingList {
  DepartmentName: string | null;
  ConsultantUnitName: string | null;
  WardName: string | null;
  EffectiveFromDate: Date | null;
  TermEndDate: Date | null;
  TotalBeds: number | null;
  BedNo: string | null;
}






      
