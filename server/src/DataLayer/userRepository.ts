import { injectable } from "inversify";
import { QueryResult } from "pg";
import { DestroyOptions } from "sequelize";
import { UserDto } from "../Bootstrapers/sequelizeBootstrap";
import { User } from "Models/user";
import { databaseError } from "../ApiControllers/controllerErrorHelpers";

export interface IUserRepository {
    get: (filterOptions?: User) => Promise<User[]>;
    insert: (data: User) => Promise<User[]>;
    update: (data: User) => Promise<User[]>;    
    delete: (id: number) => Promise<boolean>;
}

@injectable()
export class UserRepository implements IUserRepository {
        
    private usersContext = UserDto;

    constructor() {
    }

    mapResult(result: QueryResult[]): User[] {
        return result.map((result: any) => {
            
            return {
                userid: result.dataValues.userid,
                username: result.dataValues.username,
                passwordHash: result.dataValues.passwordHash,
                passwordSalt: result.dataValues.passwordSalt,
                failedLogins: result.dataValues.failedLogins,
                lastFailedLogin: result.dataValues.lastFailedLogin,
                lastLogin: result.dataValues.lastLogin
            } as User;
        });
    }

    get(filterOptions?: User): Promise<User[]> {

        const bbPromise = this.usersContext
            .findAll({
                where: filterOptions
            })
            .then((dtoResults: QueryResult[]) => this.mapResult(dtoResults));

        return Promise.resolve(bbPromise)
            .catch(error => {throw databaseError(error)});
    }

    insert(data: User): Promise<User[]> {

        const bbPromise = this.usersContext
            .upsert(data, {
                returning: true,
            })
            .then((dtoResults: [QueryResult, boolean]) => this.mapResult([dtoResults[0]]));

        return Promise.resolve(bbPromise)
            .catch(error => {throw databaseError(error)});
    }

    update(data: User): Promise<User[]>  {

        const userid = data.userid;
        data.userid = undefined;

        const bbPromise = this.usersContext
            .update(data, {
                where: { userid },
                returning: true
            })
            .then((dtoResults: [number, QueryResult[]]) => this.mapResult(dtoResults[1]));

        return Promise.resolve(bbPromise)
            .catch(error => {throw databaseError(error)});
    }

    delete(id: number): Promise<boolean> {

        const options: DestroyOptions = {
            where: { userid: id }
        }
        
        const bbPromise = this.usersContext
            .destroy(options)
            .then((result: number) => (result > 0));

        return Promise.resolve(bbPromise)
            .catch(error => {throw databaseError(error)});
    }
}
