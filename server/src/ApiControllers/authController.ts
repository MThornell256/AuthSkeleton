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
            // TODO:
            // Error username or password do not exist
        }

        this.userService.getUserByUsername(username).then((user: User) => {

            if(!user) {
                // TODO:
                // User dosn't exist
                // Error "Username or password is incorrect"
            }
            
            // Check Failed Login Cooldown
            if(user.failedLogins >= this.maxFailedLogins) {

                const currentDateTime = moment();
                const lockoutExpiry   = moment(user.lastFailedLogin).add(this.failedLoginCooldown, 'minutes')

                if(currentDateTime < lockoutExpiry) {
                    // TODO:
                    response.status(401).json({ error: `Too Many Failed Logins - 5 min lockout; ${(lockoutExpiry - currentDateTime) * 0.001} sec remaining` });
                    return;
                }
            }

            // Verify Password
            if(!this.authService.verifyPassword(user, password)) {

                // TODO:
                // Error "Username or password is incorrect"
                this.userService.updateUserLoginStatus(user, false);
                response.status(401).json({ error: "error- unauth" });
                return;
            }

            // Record Successful Login and Issue Token
            this.userService.updateUserLoginStatus(user, true);
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
            // TODO:
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
            // TODO:
            throw {
                message: err.message,
                status: 401,
                stack: err.stack
            } as ControllerError;
        }
    };

    bindLoggedInUser = (
        request: Request,
        response: Response,
        next: Function
    ): void => {
        const userid = (request as any).tokenData.userid;
        this.userService.getUserById(userid)
            .then((user: User) => {
                (request as any).user = user;
                next();
            });
    }
}
