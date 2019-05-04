import { Request, Response } from 'express';
import { UserService } from "../ServiceLayer/userService";
import { User } from '../Model/user';

export class UserController {

    private userService: UserService;

    constructor() {

        this.userService = new UserService();
    }

    createUser = (request: Request, response: Response, next: Function) => {

        const username = request.body.username;
        const password = request.body.password;

        this.userService.createUser(username, password)
            .then(result => response.json(result));
    }

    deleteUser = (request: Request, response: Response, next: Function) => {

        const userid = request.body.userid;

        this.userService.deleteUser(userid)
            .then(result => response.json(result));
    }

    updateUser = (request: Request, response: Response, next: Function) => {

        const user: User = request.body;

        this.userService.updateUser(user)
            .then(result => response.json(result));
    }

    getUser = (request: Request, response: Response, next: Function): void => {

        const user: User = {
            userid: request.query['userid'],
            username: request.query['username'],
        }

        let query;
        if((user.userid && user.username) || (!user.userid && !user.password)) {
            
            throw Error('cant filter on two/no unique criteria');
        } else if (user.userid) {
            
            query = this.userService.getUserById(user.userid);
        } else if (user.username) {
            
            query = this.userService.getUserByUsername(user.username);
        }
        
        query
            .then(result => response.json(result));
    }

    getUsers = (request: Request, response: Response, next: Function): void => {

        this.userService.getUsers()
            .then(users => response.json(users));
    }
}