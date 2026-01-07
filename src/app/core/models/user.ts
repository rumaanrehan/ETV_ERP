export interface User {
    UserFullName: string;
    UserDesignation: string;
    ProfileImagePath: string | null;
    UserTheme: string | null;
    //UserRolePermissions: UserRolePermissionsList[] | null; sochata hun iske bare me
}

export interface UserAuthenticateRequest {
    Username: string | null;
    Password: string | null;
}

export interface UserAuthenticateResponse {
    // Token: UserToken;
    User: User;
}

export interface UserAuthToken {
    AccessToken: string;
    ExpiresAt: Date;
}

export interface UserRolePermissionsList {
    AreaName: string;
    ControllerName: string;
    CanCreate: boolean;
    CanRead: boolean;
    CanUpdate: boolean;
    CanDelete: boolean;
}

export type UserPagePermissionsMap = Record<string, UserPagePermissions>;

export interface UserPagePermissions {
    CanCreate: boolean;
    CanRead: boolean;
    CanUpdate: boolean;
    CanDelete: boolean;
}

export interface UserRefreshTokenRequest {
    AccessToken: string;
}

export interface UserAccessLogRequest {
    AreaName: string;
    ControllerName: string;
    Route: string;
}

export interface UserProfile{
    UserFullName: string | null;
    OldPassword: string | null;
    NewPassword: string | null;
    ConfirmPassword: string | null;
}

// export interface OrganizationSettings {
//   OrganizationId: number | null;
//   OrganizationLogoUrl: string | null;
//   DisplayName: string | null;
//   CompanyName: string | null;
//   StreetAddress: string | null;
//   BuildingNumber: string | null;
//   District: string | null;
//   City: string | null;
//   CountryID: string | null;
//   PostalCode: string | null;
//   CrNumber: string | null;
//   VatRegistrationNumber: string | null;
//   EffectiveRegistrationDate: Date | null;
//   FirstFilingDueDate: Date | null;
//   FinancialYearEndsOn: Date | null;
//   TaxPeriod: number | null;
//   IndustryID: string | null;
//   Email: string | null;
//   Phone: string | null;

//   OrganizationLogo: File | null;
// }

export interface OrganizationSettings {
  OrganizationID: number | null;
  OrganizationName: string | null;
  OrganizationLogoUrl: string | null;
  OrganizationWebsite: string | null;
  CINNumber: string | null;
  PANNumber: string | null;
  IECNumber: string | null;
  GSTNumber: string | null;
  CRNumber: string | null;
  Industry: string | null;
  Address: string | null;
  CountryID: number | null;
  StateID: number | null;
  PostalCode: string | null;
  EmailID: string | null;
  PhoneNumber: string | null;

  ReasonToUpdate?: string | null;
  OrganizationLogoBase64?: string | null;
}
