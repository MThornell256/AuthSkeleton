import { injectable, inject } from 'inversify';

import { QueryResult } from 'pg';
import { User } from '../Models/user';
import { BaseRepository } from '../DataLayer/baseRepository';

export interface IUserRepository {
    get: (filterOptions?: User) => Promise<User[]>;
    insert: (data: User) => Promise<User[]>;
    update: (data: User) => Promise<User[]>;
    delete: (id: number) => Promise<boolean>;
} // = IRepository<User>;

@injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(@inject('Model.User') usersContext: any) {
        super(usersContext);
    }

    mapResult(result: QueryResult[]): User[] {
        return result.map((result: any) => {
            return {
                id: result.dataValues.id,
                username: result.dataValues.username,
                passwordHash: result.dataValues.passwordHash,
                passwordSalt: result.dataValues.passwordSalt,
                failedLogins: result.dataValues.failedLogins,
                lastFailedLogin: result.dataValues.lastFailedLogin,
                lastLogin: result.dataValues.lastLogin
            } as User;
        });
    }
}
