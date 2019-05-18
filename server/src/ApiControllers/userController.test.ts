import 'reflect-metadata';
import 'jest';
import { IUserController, UserController } from '../ApiControllers/userController';
import { IUserService } from 'ServiceLayer/userService';

describe('User Controller', () => {
    let userController: IUserController;
    let mockUserService: IUserService;

    beforeEach(() => {
        mockUserService = {
            createUser: jest.fn(),
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            getUserByUsername: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            updateUserLoginStatus: jest.fn()
        };

        userController = new UserController(mockUserService);
    });

    test('Create Users', (done) => {
        const request: any = {
            body: {
                username: 'username',
                password: 'password'
            }
        };

        const response: any = {
            json: () => {
                done();
            }
        };

        const next: any = {
            next: jest.fn()
        };

        mockUserService.createUser = jest.fn().mockResolvedValue(Promise.resolve({}));
        userController.createUser(request, response, next);
    });
});
