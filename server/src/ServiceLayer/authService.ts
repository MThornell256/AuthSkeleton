import * as jwt from 'jsonwebtoken'

import { User } from '../Model/user';

export interface TokenData {
    id: number,
    username:string,
}

export class AuthService { 

    private SECRET_KEY =  process.env.SECRET_KEY || 'defaultSecretKey';

    getToken(user: User): string {

        const payload: TokenData = { 
            id: user.userid, 
            username: user.username 
        };

        const tokenOptions: jwt.SignOptions = {
            expiresIn: '2h',
        };
    
        return jwt.sign({user}, this.SECRET_KEY, tokenOptions);
    }

    authenticate(token: string): TokenData {

        const verifyOptions: jwt.VerifyOptions = {

        }

        const result = jwt.verify(token, this.SECRET_KEY, verifyOptions) as TokenData;
        return result;
    }
}