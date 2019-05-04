import * as jwt from 'jsonwebtoken';
import { injectable } from "inversify";

import { TokenData } from "../Models/tokenData";
import { User } from '../Models/user';


export interface IAuthService {
    
    getToken: (user: User) => string;
    authenticate: (token: string) => TokenData;
}
@injectable()
export class AuthService implements IAuthService { 

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