export interface ImportOrderTracking {
    ImportOrderID: number | null;
    ImportOrderNo: string | null;
    ContainerNo: string | null;
    ContainerTypeID: number | null;
    ShippedDate: Date | null;
    EstimatedArrivalDate: Date | null;
    TrackingURL: string | null;
}