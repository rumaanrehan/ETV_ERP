export interface ReferredByRegistration {
  ReferredByID: number | null ;
  ReferredByCode: string | null ;
  ReferredByPrefix: string | null ;
  ReferredByName: string | null ;
  MobileNo: string | null ;
  EmailID: string | null ;
  ReferredByAddress: string | null ;
  ReferredByLocation: string | null ;
  ReferredByCity: string | null ;
}

export interface ReferredByRegistrationList {
  RowID: number;
  ReferredByID: number;
  ReferredByCode: string;
  ReferredByName: string;
  MobileNo: string;
  EmailID: string;
  ReferredByAddress: string;
  ReferredByCity: string;
  ActionType: string | null;
  ActiveStatus: boolean;
}
