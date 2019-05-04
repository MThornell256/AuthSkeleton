import { UserRepository } from "../DataLayer/userRepository";
import { User } from "../Model/user";

export class UserService {

    private userRepository: UserRepository;

    constructor() {

        this.userRepository =  new UserRepository();
    }

    createUser = (username: string, password: string): Promise<User[]> => {

        const newUser: User = {
            username,
            password
        };

        return this.userRepository.upsert(newUser);
    }

    getUsers(): Promise<User[]> {

        return this.userRepository.get();
    }

    getUserById(userid: number): Promise<User[]> {

        return this.userRepository.get({ userid });
    }

    getUserByUsername(username: string): Promise<User[]> {

        return this.userRepository.get({ username });
    }

    updateUser(user: User): Promise<User[]> {

        return this.userRepository.upsert(user);
    }

    deleteUser(id: number): Promise<boolean> {

        return this.userRepository.delete(id);
    }
}