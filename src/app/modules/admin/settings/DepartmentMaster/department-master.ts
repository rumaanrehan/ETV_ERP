 export interface DepartmentMaster {
   DepartmentID: number | null;
   DepartmentCode: string | null;
   DepartmentName: string | null;
 } 
 
 export interface DepartmentMaster_IndexTableList {
   DepartmentID: number | null;
   DepartmentCode: string | null;
   DepartmentName: string | null;
   ActiveStatus: boolean;
 }
 
 export interface DepartmentMaster_IndexTableFilter {
   DepartmentCode: string | null;
   DepartmentName: string | null;
   ActiveStatusID: number | null;
 }
 
 export interface DepartmentMaster_SelectList {
   DepartmentID: number | null;
   DepartmentName: string | null;
 }
 