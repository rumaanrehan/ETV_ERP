export interface ItemTypeMaster {
    ItemTypeID: number | null;
    ItemTypeCode: string | null;
    ItemTypeName: string | null;
}

export interface ItemType_SelectList {
    ItemTypeID: number | null;
    ItemTypeName: string | null;
}

export interface ItemTypeRequest {
    ItemTypeID?: number | null;
    PopulateType?: string | null;
}