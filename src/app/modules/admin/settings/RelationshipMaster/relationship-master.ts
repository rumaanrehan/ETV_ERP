export interface RelationshipMaster {
  RelationshipID: number | null;
  RelationshipCode: string | null;
  RelationshipName: string | null;
}

export interface RelationshipMasterList {
  RowID: number;
  RelationshipID: number;
  RelationshipCode: string;
  RelationshipName: string;
  ActionType: string | null;
  ActiveStatus: any;
}
