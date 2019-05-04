import { User } from "../Model/user";
import { UserDto } from "../Bootstrapers/sequelizeBootstrap";
import { QueryResult } from "pg";
import { DestroyOptions } from "sequelize";

export class UserRepository {
    //implements IRepository<User> {

    private usersContext = UserDto;

    mapResult(result: QueryResult[]): User[] {
        return result.map((result: any) => {
            return {
                userid: result.dataValues.userid,
                username: result.dataValues.username,
                password: result.dataValues.password
            } as User;
        });
    }

    get(filterOptions?: User): Promise<User[]> {

        const bbPromise = this.usersContext
            .findAll({
                attributes: ["userid", "username", "password"],
                where: filterOptions
            })
            .then(
                (dtoResults: QueryResult[]) => this.mapResult(dtoResults)
            );

        return Promise.resolve(bbPromise);
    }

    upsert(data: User): Promise<User[]> {

        const bbPromise = this.usersContext
            .upsert(data, {
                returning: true
            })
            .then((dtoResults: [QueryResult, boolean]) => this.mapResult([dtoResults[0]]));

        return Promise.resolve(bbPromise);
    }

    delete(id: number): Promise<boolean> {

        const options: DestroyOptions = {
            where: { userid: id }
        }
        
        const bbPromise = this.usersContext
            .destroy(options)
            .then(result => result > 0)
        
        return Promise.resolve(bbPromise);
    }
}
