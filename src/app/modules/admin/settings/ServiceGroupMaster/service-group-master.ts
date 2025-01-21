export interface ServiceGroupMaster {
    ServiceGroupID: number | null ;
    ServiceGroupCode: string | null;
    ServiceGroupName: string | null;
    ServiceGroupType: string | null;
    ShortCode: string | null;

}

export interface ServiceGroupMasterList {
    RowID: number;
    ServiceGroupID: number;
    ServiceGroupCode: string;
    ServiceGroupName: string;
    ShortCode: string;
    ServiceGroupType: string;
    ActiveStatus: boolean;
}
