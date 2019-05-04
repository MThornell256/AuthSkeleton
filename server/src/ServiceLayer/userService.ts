import { inject, injectable } from "inversify";
import { IUserRepository } from "../DataLayer/userRepository";
import { User } from "../Models/user";

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
        @inject('IUserRepository') private userRepository: IUserRepository
    ) {
    }

    createUser = (username: string, password: string): Promise<User[]> => {

        const newUser: User = {
            username,
            password
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

        return this.userRepository.update(user);
    }

    deleteUser(id: number): Promise<boolean> {

        return this.userRepository.delete(id);
    }
}