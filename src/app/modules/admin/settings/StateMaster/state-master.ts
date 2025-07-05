 export interface StateMaster {
   StateID: number | null;
   StateCode: string | null;
   StateName: string | null;
   CountryID: number | null;
 } 
 
 export interface StateMaster_SelectList {
   StateID: number | null;
   StateName: string | null;
   CountryID: number | null;
 }
 
 export interface StateMaster_IndexTableList {
   StateID: number | null;
   StateCode: string | null;
   StateName: string | null;
   CountryName: string | null;
   ActiveStatus: boolean;
 }
 
 export interface StateMaster_IndexTableFilter {
   StateCode: string | null;
   StateName: string | null;
   CountryID: number | null;
   ActiveStatusID: number | null;
 }
 