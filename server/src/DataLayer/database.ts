import { Client, QueryResult, ClientConfig, QueryConfig } from "pg";

// Postgres API Docs
// https://node-postgres.com/


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

    private getQuery(tableName: string, id: number) {
        return `SELECT * FROM ${tableName} WHERE ${tableName}Id = ${id}`;
    }
    
    private listQuery(tableName: string) {
        return `SELECT * FROM ${tableName}`;
    }

    private deleteQuery(tableName: string, id: number) {
        return `DELETE FROM ${tableName} WHERE ${tableName}Id = ${id}`;
    }

    private async executeQuery(query: QueryConfig): Promise<QueryResult> {

        const client = new Client(this.connectionData);
        await client.connect();
        return client.query(query)
    }
}