import * as express from "express";
import * as bodyParser from "body-parser";

import { Server } from "net";
import { container } from "./inversifyBootstrap";

import { IAuthController } from "../../src/ApiControllers/authController";
import { IErrorController } from "../../src/ApiControllers/errorController";
import { IUserController } from "../../src/ApiControllers/userController";

// Webpack + Typescript + Express + NodeJS Example
// Also has unit test examples
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

const PORT: number = parseInt(process.env.PORT) || 3000;
const app = express();

// Parse the json and assign it to:
// request.body
const jsonParserOptions: bodyParser.OptionsJson = {
}
app.use(bodyParser.json(jsonParserOptions));

// Create Controllers
const authController: IAuthController = container.get("IAuthController");
const userController: IUserController = container.get("IUserController");
const errorController: IErrorController = container.get("IErrorController");

// Authenticate User
app.post("/login", authController.login);
app.post("/signup", authController.login);

// Apply Authentication to the API
app.use('/api/*', authController.authenticate);

// User Endpoints
app.get('/api/user', userController.getUsers);
app.post('/api/user', userController.createUser);
app.patch('/api/user', userController.updateUser);
app.delete('/api/user', userController.deleteUser);

// Error handlers
app.use(errorController.notFoundError);
app.use(errorController.error);

const server: Server = app.listen(PORT);