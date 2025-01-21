export interface TestMethodMapping {
  TestID: number | null;
  TestMethodID: number | null;
  TotalMappedMethod: number | null;
  TestMapping: TestMethodMappingList[] | null;
}
export interface TestMethodMappingList {
  TestID: number;
  TestMethodID: number;
  IsDefault: boolean;
}
