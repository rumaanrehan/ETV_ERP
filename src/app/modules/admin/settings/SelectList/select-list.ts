export interface SelectListRequest {
  AreaName: string | null;
  ControllerName: string | null;
  FieldName: string | null;
  PopulateType: string;
}

export interface SelectList {
  ModuleName: string | null;
  PageName: string | null;
  FieldName: string | null;
  Value: string;
  Text: string;
}