export interface ExportOrderTracking {
    ExportOrderID: number | null;
    ExportOrderNo: string | null;
    ContainerNo: string | null;
    ContainerTypeID: number | null;
    ShippedDate: Date | null;
    EstimatedArrivalDate: Date | null;
    TrackingURL: string | null;
}