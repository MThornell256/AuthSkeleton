import { QueryResult } from 'pg';
import { DestroyOptions } from 'sequelize';
import { databaseError } from '../ApiControllers/controllerErrorHelpers';
import { injectable } from 'inversify';

export interface IDatabaseObject {
    id?: number;
}

export interface IRepository<T extends IDatabaseObject> {
    get: (filterOptions?: T) => Promise<T[]>;
    insert: (data: T) => Promise<T[]>;
    update: (data: T) => Promise<T[]>;
    delete: (id: number) => Promise<boolean>;
}

@injectable()
export abstract class BaseRepository<T extends IDatabaseObject> implements IRepository<T> {
    constructor(private usersContext: any) {}

    abstract mapResult(result: QueryResult[]): T[];

    get(filterOptions?: T): Promise<T[]> {
        const bbPromise = this.usersContext
            .findAll({
                where: filterOptions
            })
            .then((dtoResults: QueryResult[]) => this.mapResult(dtoResults));

        return Promise.resolve(bbPromise).catch((error) => {
            throw databaseError(error);
        });
    }

    insert(data: T): Promise<T[]> {
        const bbPromise = this.usersContext
            .upsert(data, {
                returning: true
            })
            .then((dtoResults: [QueryResult, boolean]) => this.mapResult([dtoResults[0]]));

        return Promise.resolve(bbPromise).catch((error) => {
            throw databaseError(error);
        });
    }

    update(data: T): Promise<T[]> {
        const id = data.id;
        data.id = undefined;

        const bbPromise = this.usersContext
            .update(data, {
                where: { id },
                returning: true
            })
            .then((dtoResults: [number, QueryResult[]]) => this.mapResult(dtoResults[1]));

        return Promise.resolve(bbPromise).catch((error) => {
            throw databaseError(error);
        });
    }

    delete(id: number): Promise<boolean> {
        const options: DestroyOptions = {
            where: { id: id }
        };

        const bbPromise = this.usersContext.destroy(options).then((result: number) => result > 0);

        return Promise.resolve(bbPromise).catch((error) => {
            throw databaseError(error);
        });
    }
}
