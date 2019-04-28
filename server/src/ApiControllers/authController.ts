import { Express, Request, Response } from 'express';
import { User } from '../DataLayer/userRepository';
import { AuthService } from '../ServiceLayer/authService';
import { UserService } from '../ServiceLayer/userService';
import { NextFunction } from 'connect';


export class AuthController {

    // authService: AuthService; 
    // userService: UserService;

    constructor() {
        // this.authService = new AuthService();
        // this.userService = new UserService();
    }
    
    login (request: Request, response: Response, next: NextFunction) {
        
        const authService = new AuthService(); 
        const userService = new UserService();

        console.log("login function")
        
        const username = 'myUsername';//request.headers['username'];
        const password = 'myPassword123_';//request.headers['password'];
        
        //console.log(this.userService)
        //this.userService = new UserService();
        const user = userService.getUserByUsername(username);
        console.log("user1");
        // Validate Password
        if(!user || password !== user.password) {
            // Error - username or password is incorrect
            console.log("fail result")
            response.status(401).json({error: 'error- unauth'})
        }

        // Issue Token
        console.log("success result")
        const token = authService.getToken({username: "", id: 123} as User)
        console.log("token")
        response.json({token});
    }
    
    authenticate (request: Request, response: Response, next: NextFunction) {

        //console.log(request.headers);
        const token = request.header("auth");

        const tokenData = new AuthService().authenticate(token);

        if(!tokenData) {
            // Error
            response
                .status(401)
                .send("ERROR: UNAUTH")
        }
        
        next();
    }

}