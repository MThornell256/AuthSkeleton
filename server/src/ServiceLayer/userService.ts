import { UserRepository } from "../DataLayer/userRepository";
import { User } from "../Model/user";

export class UserService {

    private userRepository: UserRepository;

    constructor() {
        
        this.userRepository =  new UserRepository();
    }

    createUser = (username: string, password: string): Promise<User> => {

        const newUser: User = {
            id: 0,
            username,
            password
        };

        return this.userRepository.insert(newUser)
    }

    getUsers(): Promise<User[]> {
        
        return null;
    }

    getUserById(userId: number): Promise<User> {
        return null;
    }

    getUserByUsername(username: string): Promise<User> {

        const user = {
            username
        } as User;

        //this.userRepository.get(user)
        return null;
    }

    updateUser(user: User): Promise<User> {

        return null;
    }

    deleteUser(id: number): Promise<boolean> {

        return null;
    }
}