import { Observable } from "rxjs";

export interface IndexTable {
  first: number | null | undefined;
  rows: number | null | undefined;
  sortField: string | string[] | null | undefined;
  sortOrder: number | null | undefined;
}

export interface DataServiceInterface {
  //getData(IndexTableParams: any): Observable<{ data: any[], recordsTotal: number }>;
}
