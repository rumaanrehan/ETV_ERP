 export interface EmployeeTypeMaster {
   EmployeeTypeID: number | null;
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
   IsAllowedOvertime: boolean | null;
 } 
 
 export interface EmployeeTypeMaster_IndexTableList {
   EmployeeTypeID: number | null;
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
   IsAllowedOvertime: boolean | null;
   ActiveStatus: boolean;
 }
 
 export interface EmployeeTypeMaster_IndexTableFilter {
   EmployeeTypeCode: string | null;
   EmployeeTypeName: string | null;
   ActiveStatusID: number | null;
 }
 
 export interface EmployeeTypeMaster_SelectList {
   EmployeeTypeID: number | null;
   EmployeeTypeName: string | null;
 }
 