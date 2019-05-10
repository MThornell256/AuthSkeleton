import * as moment from 'moment';

import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IUserService } from 'ServiceLayer/userService';
import { IAuthService } from 'ServiceLayer/authService';
import { User } from 'Models/user';
import { missingParametersError, wrapError, createError, internalError } from './controllerErrorHelpers';

export interface IAuthController {
    login: (request: Request, response: Response, next: Function) => void;
    authenticate: (request: Request, response: Response, next: Function) => void;
}

@injectable()
export class AuthController implements IAuthController {
    private maxFailedLogins = 5; // Count Failed Logins
    private failedLoginCooldown = 5; // Cooldown Time In Mins

    constructor(
        @inject('IAuthService') private authService: IAuthService,
        @inject('IUserService') private userService: IUserService
    ) {}

    login = (request: Request, response: Response, next: Function) => {
        const username: string = request.body.username;
        const password: string = request.body.password;

        if (!username || !password) {
            throw missingParametersError(['username', 'password']);
        }

        this.userService.getUserByUsername(username).then((user: User) => {
            if (!user) {
                next(createError('The Username Or Password Is Incorrect', 401));
                return;
            }

            // Check Failed Login Cooldown
            if (user.failedLogins || 0 >= this.maxFailedLogins) {
                const currentDateTime = moment();
                const lockoutExpiry = moment(user.lastFailedLogin).add(this.failedLoginCooldown, 'minutes');

                if (currentDateTime < lockoutExpiry) {
                    next(createError(`Too Many Failed Logins. Lockout Time: ${this.failedLoginCooldown} mins`, 401));
                    return;
                }
            }

            // Verify Password
            if (!this.authService.verifyPassword(user, password)) {
                // Error "Username or password is incorrect"
                this.userService
                    .updateUserLoginStatus(user, false)
                    .then((user: User[]) => next(createError('The Username Or Password Is Incorrect', 401)))
                    .catch((error) => next(error));
                return;
            }

            // Record Successful Login and Issue Token
            let token: String;
            try {
                token = this.authService.getToken(user);
            } catch (error) {
                next(internalError(error, 'Token Signing'));
                return;
            }

            this.userService
                .updateUserLoginStatus(user, true)
                .then(() => {
                    response.json({ token });
                })
                .catch((error) => next(error));
        });
    };

    authenticate = (request: Request, response: Response, next: Function): void => {
        const authHeader = request.header('authorization');
        if (!authHeader) {
            throw missingParametersError(['authorization']);
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

        if (!token) {
            // Token is not prefixed with 'Bearer'
            // or Token is an empty string.
            throw createError('Invalid Auth Token', 401);
        }

        try {
            // Put the token data onto the request so it can be accessed down the chain
            (request as any).tokenData = this.authService.authenticate(token);
            next();
        } catch (err) {
            throw wrapError(err, 'Unable To Authenticate', 401);
        }
    };

    bindLoggedInUser = (request: Request, response: Response, next: Function): void => {
        const userid = (request as any).tokenData.userid;
        this.userService.getUserById(userid).then((user: User) => {
            (request as any).user = user;
            next();
        });
    };
}
