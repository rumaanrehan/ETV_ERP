export interface ServiceCategoryMaster{
  ServiceCategoryID: number | null;
  ServiceCategoryCode: string | null;
  ServiceCategoryType: string | null;
  ServiceGroupID: number | null;
  ServiceCategoryName: string | null;
  ShortCode: string | null;
}
export interface ServiceCategoryMasterList{
  RowID: number;
  ServiceCategoryID: number;
  ServiceCategoryCode: string;
  ServiceCategoryName: string;
  ShortCode: string ;
  ServiceCategoryType: string ;
  ServiceGroupName: string;
  ActiveStatus: boolean;
}
