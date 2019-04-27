import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import { Server } from "net";

// Webpack + Typescript + Express + NodeJS Example
// Also has unit test examples
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

const PORT: number = parseInt(process.env.PORT) || 3000;
const app = express();

/* unsecured zone */
app.get("/info", (request: Request, response: Response) => {
    response.send("[INFO]");
});

app.get("/register", (request: Request, response: Response) => {
    response.send("[REGISTER]");
});

app.get("/login", (request: Request, response: Response) => {
    response.send("[LOGIN]");
});

/* secured zone */
app.get("/", (request: Request, response: Response) => {
    response.send("[HOME]");
});

/*
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
}); 

app.get("/init", (request: Request, response: Response) => {
    // open connection
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
    client.connect();

    createTable(client)
        .then(result => {
            console.log("success");
            console.log(result);

            response.send(result);
            client.end();
        })
        .catch(error => {
            console.log("shits fucked mate");
            console.log(error);

            response.send(error);
            client.end();
        });

});

app.get("/users", (request: Request, response: Response) => {
    const username = request.query["username"];
    const password = request.query["password"];
    
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
    client.connect();

    // insert or get
    ((username && password) 
        ? insertTheData(client, username, password) 
        : getAllTheData(client))
        .then(result => {
                console.log("success");
                console.log(result);

                response.send(result);
                client.end();
            })
            .catch(error => {
                console.log("shits fucked mate");
                console.log(error);

                response.send(error);
                client.end();
            });
});

const createTable = (client: Client): Promise<QueryResult> => {
    const query = `CREATE TABLE users (
userId serial PRIMARY KEY,
 username VARCHAR (50) UNIQUE NOT NULL,
 password VARCHAR (50) NOT NULL
);`;
    return client.query(query);
};

const getAllTheData = (client: Client): Promise<QueryResult> => {
    const query = `SELECT * FROM users`;
    return client.query(query);
};

const insertTheData = (
    client: Client,
    username: string,
    password: string
): Promise<QueryResult> => {

    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
    const values = [username, password];

    console.log("username/password:")
    console.log(values)

    return client.query(query, values)
};
*/
app.get("/*", (request: Request, response: Response) => {
    response.send("[Error: 404]");
});

const server: Server = app.listen(PORT);
