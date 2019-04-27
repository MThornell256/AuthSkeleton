import { Client } from "pg";

export interface IMigration {

    number: number;
    foward(client: Client): void;
}

export class DatabaseMigrator {

    migrations: IMigration[] = [];
    client: Client;

    addMigration(migration: IMigration) {
       
        const migrationsWithSanmeNumber = this.migrations
            .filter((m) => {
                return m.number === migration.number
            });
        
        if (migrationsWithSanmeNumber.length > 0) {
            // Error
        } else {
            this.migrations.push(migration);
        }
    }

    migrate() {

        // Query Database For Current Version
        const databaseVersion: number = 0;

        const migrationsToExecute = 
            this.migrations
                .filter((m => m.number > databaseVersion))
                .sort();

        // TODO: Start Transation
        
        // Do Migration
        migrationsToExecute.forEach(m => {

            m.foward(this.client);
            this.bumpVersion(this.client, m.number);
        });

        // TODO: Complete Transation

        // TODO: Rollback On Error
    }

    private bumpVersion(client: Client, version: number) {

        // TODO: bump version
    }
}