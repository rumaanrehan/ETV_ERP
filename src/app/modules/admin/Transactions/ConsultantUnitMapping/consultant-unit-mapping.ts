export interface ConsultantUnitMapping {
  ConsultantUnitID: number | null;
  DepartmentID: number | null;
  ConsultantID: number | null;
  ConsultantMapping: ConsultantUnitMappingList[] | null;
}
export interface ConsultantUnitMappingList {
  ConsultantID: number | null;
  ConsultantName: string | null;
}
