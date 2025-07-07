export interface PortMaster {
  PortID: number | null;
  PortCode: string | null;
  PortName: string | null;
  PortTypeID: number | null;
  
}

export interface PortMaster_SelectList {
  PortID: number | null;
  PortName: string | null;
  PortTypeID: string | null;
}

export interface PortMaster_IndexFilter {
  PortCode: string;
  PortName: string;
  PortTypeID: string;
  ActiveStatusID: number | null;
}
export interface PortMaster_IndexList {
  RowID: number;
  PortTypeID: number;
  PortCode: string;
  PortName: string;
  PortTypeName: string;
  ActiveStatus: boolean;
}


