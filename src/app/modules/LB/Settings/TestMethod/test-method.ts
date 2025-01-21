export interface TestMethod {
  TestMethodID: number | null;
  TestMethodCode: string | null;
  TestMethodName: string | null;
}
export interface TestMethodList {
  RowID: number;
  TestMethodID: number;
  TestMethodCode: string;
  TestMethodName: string;
  ActionType: string | null;
}
