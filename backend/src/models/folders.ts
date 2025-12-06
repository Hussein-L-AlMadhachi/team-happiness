import { PG_App, PG_Table } from "pg-norm";
import { uploads, users } from "../db.js";



export class FoldersTable extends PG_Table {

    constructor(pg_app: PG_App) {
        //     app  , table_name ,                          visible columns
        super(pg_app, 'folders', ["id", 'owner', 'file_hash', 'file_name', 'description', 'created_at']);
    }

    public async create() {

        await this.sql`
            CREATE TABLE IF NOT EXISTS ${this.sql(this.table_name)} (
                id SERIAL PRIMARY KEY,
                owner INTEGER NOT NULL,

                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),

                FOREIGN KEY (owner) REFERENCES ${this.sql(users.table_name)}(id)
            );
        `;
    }

    async filterByUser(uid: number) {
        return await this.sql`
            SELECT * FROM ${this.sql(this.table_name)} WHERE owner = ${uid};
        `;
    }


    async rename(uid: number, fid: number, name: string) {
        return await this.sql`
            UPDATE ${this.sql(this.table_name)} SET name = ${name} WHERE owner = ${uid} AND id = ${fid} RETURNING name;
        `;
    }

    async deleteUserFolder(uid: number, fid: number) {
        return await this.sql`
            DELETE FROM ${this.sql(this.table_name)} WHERE owner = ${uid} AND id = ${fid} RETURNING name;
        `;
    }

    /*  write your own methods to custom queries per your need
     *  override list(), fetch(), insert(), update() methods to change their behavoir 
     *  note that all of those are async methods
    */
}

