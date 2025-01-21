export class FixServiceMaster {
  FixServiceCode: string | null = null;
  FixServiceID: number | null = null;
  FixedID: number | null = null;
  FixServiceName: string | null = null;
  FixServiceRate: any | null = null;
  ServiceDescription: string | null = null;
  ActionType: string | null = null;
  ReasonToUpdate: string | null = null;
  ActiveStatus: any | null = null;

}
export interface FixServiceMasterList {
  RowID: number;
  FixServiceCode: string;
  FixServiceID: number;
  FixedID: number;
  FixServiceName: string;
  FixServiceRate: any;
  ServiceDescription: string;
  ActiveStatus: any;
}
