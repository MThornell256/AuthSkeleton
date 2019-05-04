import { Request, Response } from 'express';

import { AuthService, TokenData } from '../ServiceLayer/authService';
import { UserService } from '../ServiceLayer/userService';
import { User } from '../Model/user';
import { ControllerError } from './errorController';

interface IAuthRequest extends Request {
    tokenData: TokenData
}
export class AuthController {

    authService: AuthService; 
    userService: UserService;

    constructor() {
        this.authService = new AuthService();
        this.userService = new UserService();
    }
    
    login = (request: Request, response: Response, next: Function) => {
        
        console.log("login function")
        const username = request.body.username;
        const password = request.body.password;
        
        this.userService.getUserByUsername(username)
            .then(user => {

                // Validate Password
                // if(!user || password !== user.password) {
                //     // Error - username or password is incorrect
                //     response.status(401).json({error: 'error- unauth'})
                //     return;
                // }

                // Issue Token
                const token = this.authService.getToken({username: "", userid: 123} as User)
                response.json({token});
            });
    }
    
    authenticate = (request: IAuthRequest, response: Response, next: Function) => {

        try {
            const bearerToken = request.header("authorization");
            const token = bearerToken.split(' ')[1];
            request.tokenData = this.authService.authenticate(token);
        }
        catch (err) {
            throw {
                message: err.message,
                status: 401,
                stack: err.stack
            } as ControllerError;
        }

        next();
    }

}