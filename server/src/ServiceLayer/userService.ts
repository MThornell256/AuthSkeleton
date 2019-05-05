import { inject, injectable } from "inversify";
import { IUserRepository } from "../DataLayer/userRepository";
import { User } from "../Models/user";
import { IAuthService } from "./authService";

export interface IUserService {
    createUser: (username: string, password: string) => Promise<User[]>
    getUsers: () => Promise<User[]> 
    getUserById: (userid: number) => Promise<User> 
    getUserByUsername: (username: string) => Promise<User> 
    updateUser: (user: User) => Promise<User[]> 
    deleteUser: (id: number) => Promise<boolean> 

}

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IAuthService') private authService: IAuthService
    ) {
    }

    createUser = (username: string, password: string): Promise<User[]> => {

        const newUser: User = {
            username,
            ...this.generatePasswordData(password)
        };

        return this.userRepository.insert(newUser);
    }

    getUsers(): Promise<User[]> {

        return this.userRepository.get();
    }

    getUserById(userid: number): Promise<User> {

        return this.userRepository.get({ userid })
            .then(users => users[0]);
    }

    getUserByUsername(username: string): Promise<User> {

        return this.userRepository.get({ username })
            .then(users => users[0]);
    }

    updateUser(user: User): Promise<User[]> {

        return this.userRepository.update(this.stripPasswordData(user));
    }

    deleteUser(id: number): Promise<boolean> {

        return this.userRepository.delete(id);
    }

    updatePassword(userid: number, password: string): Promise<User[]> {

        const userData: User = {
            userid,
            ...this.generatePasswordData(password)
        };
        
        return this.userRepository.update(userData);
    }

    private stripPasswordData(user: User): User {

        user.passwordHash = undefined;
        user.passwordSalt = undefined;
        return user;
    }

    private generatePasswordData(password: string): User {

        const passwordSalt = this.authService.generateSalt();
        const passwordHash = this.authService.getPasswordHash(password, passwordSalt);

        return {
            passwordHash,
            passwordSalt,
        };
    }
}