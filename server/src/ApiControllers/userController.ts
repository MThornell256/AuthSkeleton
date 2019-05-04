import { inject, injectable } from "inversify";
import { Request, Response } from 'express';
import { User } from '../Models/user';
import { IUserService } from "../ServiceLayer/userService";


export interface IUserController {

    createUser: (request: Request, response: Response, next: Function) => void;
    deleteUser: (request: Request, response: Response, next: Function) => void;
    updateUser: (request: Request, response: Response, next: Function) => void;
    getUser: (request: Request, response: Response, next: Function) => void;
    getUsers: (request: Request, response: Response, next: Function) => void;
}

@injectable()
export class UserController implements IUserController {

    constructor(
        @inject("IUserService") private userService: IUserService
    ) {
    }

    createUser = (request: Request, response: Response, next: Function): void => {

        const username = request.body.username;
        const password = request.body.password;

        this.userService.createUser(username, password)
            .then(result => response.json(result));
    }

    deleteUser = (request: Request, response: Response, next: Function): void => {

        const userid = request.body.userid;

        this.userService.deleteUser(userid)
            .then(result => response.json(result));
    }

    updateUser = (request: Request, response: Response, next: Function): void => {

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