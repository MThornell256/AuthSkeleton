import { Request, Response } from 'express';

export interface ControllerError {

    message: string,
    status: number,
    stack: string,
}

export class ErrorController {

    notFoundError = (request: Request, response: Response, next: Function) => {
        throw {
            message: "404 Not Found",
            status: 404,
        };
    }

    error = (err: any, req: Request, res: Response, next: Function) => {
        console.log('Error Handler');

        res.status(err.status || 500);
        res.json({
            message: err.message,
            status: err.status,
            stackTrace: err.stack
        });
    }
}