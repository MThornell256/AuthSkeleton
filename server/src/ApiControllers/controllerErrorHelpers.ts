import { ControllerError } from "./errorController";

export function missingParametersError(missingParams?: string[]) {

    return {
        ...wrapError(null, "The Request Is Missing Required Parmaters: " + missingParams, 400),
        type: "Malformed Request",
    }
}

export function databaseError(innerError: any): ControllerError {

    return internalError(innerError, "Database Error");
}

export function internalError(innerError: any, type: string): ControllerError {

    return {
        ...wrapError(innerError, "Unable To Process Your Request"),
        type
    }
}

export function createError(message: string, status: number = 500): ControllerError {

    return {
        ...wrapError(null, message, status),
        logError: false
    };
}

export function wrapError(innerError: any, message: string, status: number = 500): ControllerError {

    return {
        error: true,
        message,
        status,
        innerError,
        logError: true
    } as ControllerError;
}