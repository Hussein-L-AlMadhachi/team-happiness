import { PG_App, PG_Table } from "pg-norm";
import { folders, users } from "../db.js";



export class UploadsTable extends PG_Table {

    constructor(pg_app: PG_App) {
        //     app  , table_name ,                          visible columns
        super(pg_app, 'uploads', ["id", 'owner', 'file_hash', 'file_name', 'description', 'created_at']);
    }

    public async create() {

        // it is very important to create column named id
        await this.sql`
            CREATE TABLE IF NOT EXISTS uploads (
                id SERIAL PRIMARY KEY,
                owner INTEGER NOT NULL,

                file_name VARCHAR(255) NOT NULL,
                file_hash VARCHAR(255) NOT NULL,
                description TEXT DEFAULT '',

                parent_folder INTEGER DEFAULT NULL,
                created_at TIMESTAMP DEFAULT NOW(),

                FOREIGN KEY (owner) REFERENCES ${this.sql(users.table_name)}(id),
                FOREIGN KEY (parent_folder) REFERENCES ${this.sql(folders.table_name)}(id)
            );
        `;

        await this.sql`
            CREATE INDEX IF NOT EXISTS ${this.sql(`idx_${this.table_name}_file_hash`)} ON ${this.sql(this.table_name)} (file_hash);
        `;
    }


    async filterUploadsByUser(uid: number) {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM
                ${this.sql(this.table_name)} WHERE owner = ${uid}
        `;
    }

    async filterUploadsByHash(file_hash: string) {
        return await this.sql`
            SELECT ${this.sql(this.visibles)} FROM
                ${this.sql(this.table_name)} WHERE file_hash = ${file_hash}
        `;
    }

    async deleteFromUploadsForUser(uid: number, file_id: number) {
        return await this.sql`
            DELETE FROM ${this.sql(this.table_name)} WHERE owner = ${uid} AND id = ${file_id} RETURNING file_name;
        `;
    }

    async addToFolder(uid: number, folder_id: number, file_id: number) {
        return await this.sql`
            UPDATE ${this.sql(this.table_name)} SET parent_folder = ${folder_id} WHERE owner = ${uid} AND id = ${file_id} RETURNING file_name;
        `;
    }

    async removeFromFolder(uid: number, file_id: number) {
        return await this.sql`
            UPDATE ${this.sql(this.table_name)} SET parent_folder = NULL WHERE owner = ${uid} AND id = ${file_id} RETURNING file_name;
        `;
    }

    /*  write your own methods to custom queries per your need
     *  override list(), fetch(), insert(), update() methods to change their behavoir 
     *  note that all of those are async methods
    */
}

