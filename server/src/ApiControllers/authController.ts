import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { User } from "Models/user";
import { ControllerError } from "./errorController";
import { IAuthService } from "ServiceLayer/authService";
import { IUserService } from "ServiceLayer/userService";

export interface IAuthController {
    login: (request: Request, response: Response, next: Function) => void;
    authenticate: (request: Request, response: Response, next: Function) => void;
}

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject("IAuthService") private authService: IAuthService,
        @inject("IUserService") private userService: IUserService
    ) {}

    login = (request: Request, response: Response, next: Function) => {
        console.log("login function");
        const username = request.body.username;
        const password = request.body.password;

        this.userService.getUserByUsername(username).then((user: User) => {

            // Validate Password
            if (!user || password !== user.password) {
                // Error - username or password is incorrect
                response.status(401).json({ error: "error- unauth" });
                return;
            }

            // Issue Token
            const token = this.authService.getToken({
                username: "",
                userid: 123
            } as User);
            response.json({ token });
        });
    };

    authenticate = (request: Request, response: Response, next: Function): void => {

        try {
            const bearerToken = request.header("authorization");
            const token = bearerToken.split(" ")[1];
            (request as any).tokenData = this.authService.authenticate(token);
        } catch (err) {
            throw {
                message: err.message,
                status: 401,
                stack: err.stack
            } as ControllerError;
        }

        next();
    };
}