import * as express from "express";
import * as path from 'path';
import { Request, Response } from "express";

// Webpack + Typescript + Express + NodeJS Example
// Also has unit test examples
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

console.log('Test 1')

const PORT: number = parseInt(process.env.PORT) || 8080;
const app = express();

//console.log();
console.log('Port: ' + PORT);
console.log(process);

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

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

app.get("/*", (request: Request, response: Response) => {
    response.send("[Error: 404]");
  });

app.listen(PORT, "0.0.0.0");
