import { injectable } from "inversify";
import { Request, Response } from 'express';

export interface IErrorController {
    notFoundError: (request: Request, response: Response, next: Function) => void
    error: (error: any, request: Request, response: Response, next: Function) => void
}

export interface ControllerError {

    message: string,
    status: number,
    stack: string,
}

@injectable()
export class ErrorController implements IErrorController {

    notFoundError = (request: Request, response: Response, next: Function) => {
        throw {
            message: "404 Not Found",
            status: 404,
        };
    }

    error = (error: any, req: Request, res: Response, next: Function) => {
        console.log('Error Handler');

        res.status(error.status || 500);
        res.json({
            message: error.message,
            status: error.status,
            stackTrace: error.stack
        });
    }
}