import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { createHmac } from 'crypto';

import { TokenData } from '../Models/tokenData';
import { User } from '../Models/user';

export interface IAuthService {
    getToken: (user: User) => string;
    authenticate: (token: string) => TokenData;
    getPasswordHash: (password: string, passwordSalt: string) => string;
    generateSalt: () => string;
    verifyPassword: (user: User, password: string) => boolean;
}
@injectable()
export class AuthService implements IAuthService {
    private SECRET_KEY = process.env.SECRET_KEY || 'defaultSecretKey';

    getToken(user: User): string {
        // Remove any sensitive data from the user

        if (!user.userid || !user.username) {
            throw Error('Username or Password is undefined');
        }

        const payload: TokenData = {
            userid: user.userid,
            username: user.username
        };

        const tokenOptions: jwt.SignOptions = {
            expiresIn: '2h'
        };

        return jwt.sign(payload, this.SECRET_KEY, tokenOptions);
    }

    authenticate(token: string): TokenData {
        const verifyOptions: jwt.VerifyOptions = {};

        const result = jwt.verify(token, this.SECRET_KEY, verifyOptions) as TokenData;
        return result;
    }

    getPasswordHash(password: string, passwordSalt: string): string {
        return createHmac('sha256', password + passwordSalt).digest('hex');
    }

    generateSalt(): string {
        // Produce Random String
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

        const randomString = Math.random()
            .toString(36)
            .substring(2);
        return createHmac('sha256', randomString).digest('hex');
    }

    verifyPassword(user: User, password: string): boolean {
        if (!user) {
            return false;
        }

        const passwordHash = this.getPasswordHash(password, user.passwordSalt || '');

        // Validate Password Match
        return passwordHash === user.passwordHash;
    }
}
