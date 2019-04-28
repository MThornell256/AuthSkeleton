import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import { Server } from "net";

import { NextFunction } from "connect";
import { AuthController } from "./src/ApiControllers/authController";

// Webpack + Typescript + Express + NodeJS Example
// Also has unit test examples
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

const PORT: number = parseInt(process.env.PORT) || 3000;
const app = express();

app.get("/error", (request: Request, response: Response) => {
    throw Error('My Error Message')
})

app.get("/auth", new AuthController().login);



app.post("/secure", new AuthController().authenticate, (request: Request, response: Response) => {
    response.send("SECURE RESOURCE POST");
});

app.get("/secure", new AuthController().authenticate, (request: Request, response: Response) => {
    response.send("SECURE RESOURCE GET");
});

// 404 Not Found handler
app.use((request: Request, response: Response, next: NextFunction) => {
    
    response
    .status(404)
    .send("[Error: 404]");
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {

    console.log('Error Handler')
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send(res.locals.message + res.locals.error);
  });

  const server: Server = app.listen(PORT);
