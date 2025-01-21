export interface TestGroupMapping {
  TestGroupID: number | null;
  TestMapping: TestGroupMappingList[] | null;
}
export interface TestGroupMappingList {
  ServiceCategoryID: number;
}
