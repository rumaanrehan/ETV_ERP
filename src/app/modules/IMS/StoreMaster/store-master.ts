export interface StoreMaster {
 StoreID: number | null;
 StoreCode: string | null;
 StoreName: string | null;
 CanIssueToStores: boolean;
 CanIssueToPatients: boolean;
 CanRaiseIndent: boolean;
 InwardAcceptType: number | null;
 CanUpdate: boolean;
}

export interface StoreMaster_SelectList{
 StoreID: number;
 StoreName: string;
 CategoryType: number;
 CategoryTypeName: string;
}

export interface StoreMaster_IndexTableFilter{
 StoreCode: string | null;
 StoreName: string | null;
 ActiveStatusID: number | null;
}

export interface StoreMaster_IndexTableList{
 RowID: number;
 StoreID: number;
 StoreCode: string;
 StoreName: string;
 CanIssueToStores: boolean;
 CanIssueToPatients: boolean;
 CanRaiseIndent: boolean;
 InwardAcceptTypeName: string;
 ActiveStatus: boolean;
 CanDelete: boolean;
}
