import { QueryResult } from "pg";

import { IRepository } from "./repository";
import { Database } from "./database";
import { User } from "../Model/user";

export class UserRepository implements IRepository<User> {

    private tableName: string = 'users';
    private database: Database = new Database();
    
    async get(id: number): Promise<User> {
        return this.database
            .get(this.tableName, id)
            .then((response: QueryResult) => {
                return response.rows[0];
            });
    }

    list(): Promise<User[]> {
        return this.database
            .list(this.tableName)
            .then((response: QueryResult) => {
                return response.rows;
            });
    }
    
    insert(data: User): Promise<User> {
        return null;
    }

    update(data: User): Promise<User> {
        return null;
    }

    delete(id: number): Promise<boolean> {
        
        return null;
        // return this.database
        //     .delete(this.tableName, id)
    }
}