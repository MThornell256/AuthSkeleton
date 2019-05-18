export interface User {
    id?: number;
    username?: string;
    passwordHash?: string;
    passwordSalt?: string;
    failedLogins?: number;
    lastFailedLogin?: Date;
    lastLogin?: Date;
}
