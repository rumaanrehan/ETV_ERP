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