import "reflect-metadata";
import { Container } from 'inversify';
import { UserRepository } from '../DataLayer/userRepository';
import { UserService } from "../ServiceLayer/userService";

export const container = new Container();

container.bind("IUserService").to(UserService).inSingletonScope();
container.bind("IUserRepository").to(UserRepository).inSingletonScope();