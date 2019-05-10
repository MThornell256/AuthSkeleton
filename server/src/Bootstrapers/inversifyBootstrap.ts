import "reflect-metadata";
import { Container } from 'inversify';

import { UserRepository } from '../DataLayer/userRepository';

import { AuthService } from "../ServiceLayer/authService";
import { UserService } from "../ServiceLayer/userService";

import { AuthController } from "../ApiControllers/authController";
import { UserController } from "../ApiControllers/userController";
import { ErrorController } from "../ApiControllers/errorController";
import { UserDto } from "./sequelizeBootstrap";

export const container = new Container();

// Controllers
container.bind("IAuthController").to(AuthController).inSingletonScope();
container.bind("IUserController").to(UserController).inSingletonScope();
container.bind("IErrorController").to(ErrorController).inSingletonScope();

// Services
container.bind("IAuthService").to(AuthService).inSingletonScope();
container.bind("IUserService").to(UserService).inSingletonScope();

// Repositories
container.bind("IUserRepository").to(UserRepository).inSingletonScope();

container.bind("Model.User").toConstantValue(UserDto);