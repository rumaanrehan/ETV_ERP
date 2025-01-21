export interface ProfileTestMapping {
  TestMappingID: number | null;
  ProfileID: number | null;
  TestID: number | null;
  TotalMappedTest: number | null;
  TestMapping: ProfileTestMappingList[] | null;
}
export interface ProfileTestMappingList {
  TestID: number;
  ActionType: string;
}
