export interface OrganismMapping {
  OrganismID: number | null;
  TestID: number | null;
  AntibioticID: number | null;
  TotalMappedAntibiotic: number | null;
  OrgMapping: OrganismMappingList[] | null;
}
export interface OrganismMappingList {
  AntibioticID: number
}
