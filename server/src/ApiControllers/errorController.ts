import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { createError, internalError } from './controllerErrorHelpers';

export interface IErrorController {
    notFoundError: (request: Request, response: Response, next: Function) => void;
    error: (error: any, request: Request, response: Response, next: Function) => void;
}

export interface ControllerError {
    error: boolean;
    status: number;
    message: string;
    type: string;
    logError: boolean;
    innerError: any;
}

@injectable()
export class ErrorController implements IErrorController {
    notFoundError = (request: Request, response: Response, next: Function) => {
        throw createError('Not Found', 404);
    };

    error = (error: any, req: Request, res: Response, next: Function) => {
        // If Not A Controller Error Wrap It In One
        if (!error.error) {
            error = internalError(error, 'Unhandeled Error');
        }

        // If innerError is actually an 'Error' change it to an object;
        // Error objects dont serialize to JSON Properly
        error.innerError = error.innerError instanceof Error ? this.errorToObject(error.innerError) : error.innerError;

        if (error.logError) {
            this.logError(error);
        }

        const isDev = true;
        if (!isDev) {
            // Sanitize Error
            error.type = undefined;
            error.innerError = undefined;
        }

        // TODO: If Prod Then Sanitise Error
        // TODO: Log Error
        res.status(error.status);
        res.json(error);
        return;
    };

    private errorToObject(error: Error): any {
        const errorAsObj: any = {};
        const keys = Object.getOwnPropertyNames(error);

        for (const key of keys) {
            errorAsObj[key] = (error as any)[key];
        }

        return errorAsObj;
    }

    private logError(error: ControllerError): void {
        // TODO:
    }
}
