import { Client, QueryResult, ClientConfig, QueryConfig } from "pg";

// Postgres API Docs
// https://node-postgres.com/

interface DatabaseObject {
    id: number
}
export class Database {

    private connectionData: ClientConfig = {
        connectionString: process.env.DATABASE_URL || 'default',
        ssl: true
    };

    get(tableName: string, id: number): Promise<QueryResult> {
        const query: QueryConfig = {
            text: this.getQuery(tableName, id),
        };
        return this.executeQuery(query);
    }

    list(tableName: string): Promise<QueryResult> {
        const query: QueryConfig = {
            text: this.listQuery(tableName),
        };
        return this.executeQuery(query);
    }

    delete(tableName: string, id: number): Promise<QueryResult> {
        const query: QueryConfig = {
            text: this.deleteQuery(tableName, id),
        };
        return this.executeQuery(query);
    }

    update(tableName: string, obj: DatabaseObject): Promise<QueryResult> {

        const query: QueryConfig = {
            text: this.updateQuery(tableName, obj),
        };
        return this.executeQuery(query);
        
        return null;
    }

    private getQuery(tableName: string, id: number) {
        return `SELECT * FROM ${tableName} WHERE ${tableName}Id = ${id}`;
    }
    
    private listQuery(tableName: string) {
        return `SELECT * FROM ${tableName}`;
    }

    private deleteQuery(tableName: string, id: number) {
        return `DELETE FROM ${tableName} WHERE ${tableName}Id = ${id}`;
    }

    private updateQuery(tableName: string, obj: DatabaseObject) {

        let query = `UPDATE ${tableName} `;

        const keys = Object.keys(obj);
        let count = 0;
        for (const key of keys) {

            if(key !== 'id') {

                const value = (obj as any)[key];

                if (typeof(value) === 'string') {
                    
                    query += `SET ${key} = '${(obj as any)[key]}'`;
                } else  {

                    query += `SET ${key} = ${(obj as any)[key]}`;
                }
            } 

            if(count < keys.length) {
                query += ', ';
            }

            count++;
        }

        query += `WHERE ${tableName}Id = ${obj.id}`

        return query;
    }

    private createQuery(tableName: string, obj: DatabaseObject) {

        let query = `UPDATE ${tableName} `;

        const keys = Object.keys(obj);
        let count = 0;
        for (const key of keys) {

            if(key !== 'id') {

                const value = (obj as any)[key];

                if (typeof(value) === 'string') {
                    
                    query += `SET ${key} = '${(obj as any)[key]}'`;
                } else  {

                    query += `SET ${key} = ${(obj as any)[key]}`;
                }
            } 

            if(count < keys.length) {
                query += ', ';
            }

            count++;
        }

        query += `WHERE ${tableName}Id = ${obj.id}`

        return query;
    }

    private async executeQuery(query: QueryConfig): Promise<QueryResult> {

        const client = new Client(this.connectionData);
        await client.connect();
        return client.query(query)
    }
}