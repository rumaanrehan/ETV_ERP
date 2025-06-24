import { ExportOrder } from "../ExportOrder/export-order";

export interface ExportContainer {
    ContainerID: number | null;
    ContainerNo: string | null;
    ExportOrders: ExportOrder[] | null;
    ContainerType: string | null;
    ShippedDate: Date | null;
    EstimatedArrivalDate: Date | null;
    TrackingURL: string | null;
}

export interface ExportContainer_IndexTableList {
    ContainerID: number | null;
    ContainerNo: string | null;
    ContainerType: string | null;
    ShippedDate: Date | null;
    EstimatedArrivalDate: Date | null;
}

export interface ExportContainer_IndexTableFilter {
    ContainerNo: string | null;
    ContainerType: string | null;
}