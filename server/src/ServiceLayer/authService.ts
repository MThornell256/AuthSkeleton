import * as jwt from 'jsonwebtoken'
import { User } from '../DataLayer/userRepository';

export interface ITokenData {
    id: number,
    username:string,
}

export class AuthService { 

    private SECRET_KEY =  process.env.SECRET_KEY || 'defaultSecretKey';

    getToken(user: User): string {

        const payload: ITokenData = { 
            id: user.id, 
            username: user.username 
        };

        const tokenOptions: jwt.SignOptions = {
            expiresIn: '2h',
        };
    
        return jwt.sign({user}, this.SECRET_KEY, tokenOptions);
    }

    authenticate(token: string): ITokenData {

        const verifyOptions: jwt.VerifyOptions = {

        }

        const result = jwt.verify(token, this.SECRET_KEY, verifyOptions) as ITokenData;
        return result;
    }
}