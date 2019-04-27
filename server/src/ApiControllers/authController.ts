import { Express, Request, Response } from 'express';

export class AuthController {

    get(request: Request, response: Response): void {

    }

    post(request: Request, response: Response): void {

    }

    delete(request: Request, response: Response): void {

    }

    put(request: Request, response: Response): void {

    }

    patch(request: Request, response: Response): void {

    }

    register(client: Express): void {
        client.get('user', this.get)
        client.post('user', this.post)
        client.delete('user', this.delete)
        client.put('user', this.put)
        client.patch('user', this.patch)
    }
}