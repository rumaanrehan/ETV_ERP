export interface PortMaster {
  PortID: number | null;
  PortCode: string | null;
  PortName: string | null;
  PortTypeID: number | null;
  CountryID: number | null;
}

export interface Port_SelectList {
  PortID: number | null;
  PortName: string | null;
}

export interface Port_IndexFilter {
  PortCode: string;
  PortName: string;
  PortTypeID: number;
  CountryName: string;
  ActiveStatusID: number | null;
}

export interface Port_IndexList {
  RowID: number;
  PortID: number;
  PortCode: string;
  PortName: string;
  PortTypeName: string;
  CountryName: string;
  ActiveStatus: boolean;
}

export interface PortRequest {
  PortCode?: string | null;
  PortName?: string | null;
  PopulateType?: string | null;
}