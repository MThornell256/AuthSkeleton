import { inject, injectable } from "inversify";
import { Request, Response } from 'express';
import { User } from '../Models/user';
import { IUserService } from "../ServiceLayer/userService";
import { missingParametersError } from "./controllerErrorHelpers";


export interface IUserController {

    createUser: (request: Request, response: Response, next: Function) => void;
    deleteUser: (request: Request, response: Response, next: Function) => void;
    updateUser: (request: Request, response: Response, next: Function) => void;
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

        if(!username || !password) {
            throw missingParametersError(["username", "password"])
        }

        this.userService.createUser(username, password)
            .then(result => response.json(result))
            .catch(error => next(error));
    }

    deleteUser = (request: Request, response: Response, next: Function): void => {

        const userid = request.body.userid;

        if(!userid) {
            throw missingParametersError(["userid"])
        }

        this.userService.deleteUser(userid)
            .then(result => response.json(result))
            .catch(error => next(error));
    }

    updateUser = (request: Request, response: Response, next: Function): void => {

        const user: User = request.body;

        if(!user.userid) {
            throw missingParametersError(["userid"])
        }

        this.userService.updateUser(user)
            .then(result => response.json(result))
            .catch(error => next(error));
    }

    getUsers = (request: Request, response: Response, next: Function): void => {

        const user: User = {
            userid: request.query['userid'],
            username: request.query['username'],
        }

        let query: Promise<User | User[]>;
        if (user.userid) {

            query = this.userService.getUserById(user.userid);
        } else if (user.username) {
            
            query = this.userService.getUserByUsername(user.username);
        } else {

            query = this.userService.getUsers();
        }

        query
            .then((users: any) => response.json(users))
            .catch(error => next(error));
    }
}