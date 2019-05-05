import * as moment from 'moment';

import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { User } from "Models/user";
import { ControllerError } from "./errorController";
import { IAuthService } from "ServiceLayer/authService";
import { IUserService } from "ServiceLayer/userService";

export interface IAuthController {
    login: (request: Request, response: Response, next: Function) => void;
    authenticate: (
        request: Request,
        response: Response,
        next: Function
    ) => void;
}

@injectable()
export class AuthController implements IAuthController {

    private maxFailedLogins = 5;                // Count Failed Logins
    private failedLoginCooldown = 5;            // Cooldown Time In Mins

    constructor(
        @inject("IAuthService") private authService: IAuthService,
        @inject("IUserService") private userService: IUserService
    ) {}

    login = (request: Request, response: Response, next: Function) => {
        const username: string = request.body.username;
        const password: string = request.body.password;

        if (!username || !password) {
            // Error username or password do not exist
        }

        this.userService.getUserByUsername(username).then((user: User) => {

            // Check Failed Login Cooldown
            if(user.failedLogins > this.maxFailedLogins) {

                // TODO: Finsih This:
                const currentDateTime = moment();
                const lastFailedLogin = moment(user.lastFailedLogin);
                const thresholdTime = lastFailedLogin.add(this.failedLoginCooldown, 'minutes').calendar();

                console.log("currentDateTime: " + currentDateTime)
                console.log("lastFailedLogin: " + lastFailedLogin)
                console.log("thresholdTime: " + thresholdTime)

                // if(currentTime < thresholdTime) {
                //     // Error
                // }
            }

            // Verify Password
            if(!this.authService.verifyPassword(user, password)) {

                // Error "Username or password is incorrect"
                // TODO: Increase Failed Login Info In Database
                response.status(401).json({ error: "error- unauth" });
                return;
            }

            // TODO: Update Login Info In Database

            // Issue Token
            const token = this.authService.getToken(user);
            response.json({ token });
        });
    };

    authenticate = (
        request: Request,
        response: Response,
        next: Function
    ): void => {

        const authHeader = request.header("authorization");
        if(!authHeader) {
            // No Auth Header Exists
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;
        
        if(!token) {
            // Token is not prefixed with 'Bearer'
            // or Token is an empty string.
            // TODO: -> Invalid Auth Token (401)
        }
        
        try {
            // Put the token data onto the request so it can be accessed down the chain
            (request as any).tokenData = this.authService.authenticate(token);
            next();
        
        } catch (err) {
            throw {
                message: err.message,
                status: 401,
                stack: err.stack
            } as ControllerError;
        }
    };
}
