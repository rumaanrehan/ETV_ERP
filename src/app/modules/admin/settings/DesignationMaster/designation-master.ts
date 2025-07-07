 export interface DesignationMaster {
   DesignationID: number | null;
   DesignationCode: string | null;
   DesignationName: string | null;
 } 
 
 export interface DesignationMaster_IndexTableList {
   DesignationID: number | null;
   DesignationCode: string | null;
   DesignationName: string | null;
   ActiveStatus: boolean;
 }
 
 export interface DesignationMaster_IndexTableFilter {
   DesignationCode: string | null;
   DesignationName: string | null;
   ActiveStatusID: number | null;
 }
 
 export interface DesignationMaster_SelectList {
   DesignationID: number | null;
   DesignationName: string | null;
 }
 