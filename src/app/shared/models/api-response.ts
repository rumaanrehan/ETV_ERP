// Base server response interface for common fields
export interface ServerResponse {
  Status: string;
  Message?: string;
  ValidationErrors?: ValidationError[];

  /*
    Success = 1,
    Info = 2,
    Invalid = 3,
    Conflict = 4,
    Warning = 5,
    Error = 6,
    CriticalError = 7,
    NotFound = 8,
    Forbidden = 9,
    Unauthorized = 10,
    Unavailable = 11
   */
}

// Validation error interface
export interface ValidationError {
  PropertyName?: string;
  ErrorMessage?: string;
}

// Base response interface for API
export interface ApiResponse extends ServerResponse {
  IsSuccess: boolean;
}

// Response with a single data item
export interface ApiDataResponse<T> extends ApiResponse {
  Data: T;
}

// Response with a list of items
export interface ApiListResponse<T> extends ApiDataResponse<TList<T>> {
  
}

export interface TList<T> {
  Items: T[];
}

// Paged response with a list of items and total record count
export interface ApiPagedListResponse<T> extends ApiDataResponse<TPagedList<T>> {
  
}

export interface TPagedList<T> extends TList<T> {
  TotalRecords: number;
}



/* Deprecated Interface */
export interface ApiTResponse<T> {
  IsSuccess: boolean;
  Status: string;
  Message?: string;
  ValidationErrors?: ValidationError[];
  Data: T;
}

export interface TResultList<T> {
  Items: T[];
}

export interface TResultPagedList<T> {
  Items: T[];
  TotalRecords: number;
}

export interface ApiResponsePagedList<T> {
  IsSuccess: boolean;
  Status: string;
  Message?: string;
  ValidationErrors?: ValidationError[];
  Items: T[];
  TotalRecords: number;
}

// export interface ValidationError {
//   PropertyName?: string;
//   ErrorMessage?: string;
// }
