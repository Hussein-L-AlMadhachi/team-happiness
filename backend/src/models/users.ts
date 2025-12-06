import { PG_App, PG_AuthTable } from "pg-norm";



export class UsersTable extends PG_AuthTable {

    constructor(pg_app: PG_App) {
        //      app  , table_name ,           visible columns             ,  identify user by
        super(pg_app, 'users', ["id", 'name', 'role', 'email', "limits"], "email");
    }

    public async create() {

        // it is very important to create column named id
        await this.sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(20) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                ${this.sql(this.passwordField)} TEXT NOT NULL,

                limits VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `;
    }

    /*  write your own methods to custom queries per your need
     *  override list(), fetch(), insert(), update() methods to change their behavoir 
     *  note that all of those are async methods
    */
}



/**
 *   now you can import users and use all the methods that can be used PG_Table are available in PG_AuthTable
 *   with some notes:
 *   
 *      1. you need to create a field called `password_hash` and the user identifying field you specified 
 *          in "identify user by" field (in this case the field call "username" so you need to create a
 *           field called username) as shown in create().
 *  
 *      2. when you insert rows you can fill a field called `password` (insert will hash it for you but don't 
 *                                                                    create this column in database)
 *
 *      3. update() cannot update passwords (unless you change it to do it which is very discouraged)
 *      4. to update password you use updatePassword( id , new_plaintext_password ) method
 *      5. to verify passwords you can use verifyPassword( id , plaintext_password )
 *
 * 
 * 
 *   in conclusion you have 3 methods extra methods (one overwritten):
 * 
 *      await products.insert( {...} );    // insert a new rows and fill the column with data (only lets you insert visible columns, 
 *                                                                                             but with additional "password" field that
 *                                                                                             will be hashed and added for you)
 *
 *      await updatePassword( 1 , "pass123" );    // update password to "pass123" of user with id 1
 *
 *      await verifyPassword( "ali@email.com" , "pass123" );   // verify the password of the user identified with "ali@email.com" and
 *      await fetchAfterAuth( "ali@email.com" , "pass123" , ["id" , "role"] );    // update password to "pass123" of user with id 1
 *      await idAfterAuth( "ali@email.com" , "pass123");    // update password to "pass123" of user with id 1
 *                                                                check if it equals "pass123" 
 *
**/


