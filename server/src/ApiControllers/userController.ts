import { Request, Response } from 'express';
import { UserService } from "../ServiceLayer/userService";

export class UserController {

    private userService: UserService;

    constructor() {

        this.userService = new UserService();
    }

    createUser = (request: Request, response: Response, next: Function) => {

        response.send('create User');
    }

    deleteUser = (request: Request, response: Response, next: Function) => {

        response.send('delete User');
    }

    updateUser = (request: Request, response: Response, next: Function) => {

        response.send('update User');
    }

    getUser = (request: Request, response: Response, next: Function): void => {

        const id = request.query['id'];
        const username = request.query['username'];

        const urlTokens = request.url
            .split('/')
            .filter((x)=> x.length > 0);

        response.send('get User');
    }

    getUsers = (request: Request, response: Response, next: Function): void => {

        response.send('get Users');
    }
}