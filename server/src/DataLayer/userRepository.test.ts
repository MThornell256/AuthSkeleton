import 'reflect-metadata';
import 'jest';

import { IUserRepository, UserRepository } from './userRepository';
import { User } from 'Models/user';

const mockUser: User = {
    id: 666,
    username: 'user',
    passwordHash: 'PasswordHash',
    passwordSalt: 'PasswordSalt'
};

function createMockQueryResult(user: User) {
    return {
        dataValues: {
            ...user
        }
    };
}

describe('User Repository', () => {
    let userRepository: IUserRepository;
    let mockUserContext: any;

    beforeEach(() => {
        mockUserContext = {
            findAll: jest.fn().mockReturnValue(Promise.resolve([createMockQueryResult(mockUser)])),
            upsert: jest.fn().mockReturnValue(Promise.resolve([createMockQueryResult(mockUser)])),
            update: jest.fn().mockReturnValue(Promise.resolve([0, [createMockQueryResult(mockUser)]])),
            destroy: jest.fn().mockReturnValue(Promise.resolve(1))
        };

        userRepository = new UserRepository(mockUserContext);
    });

    test('Gets Users', (done) => {
        userRepository.get().then((result) => {
            expect(mockUserContext.findAll).toBeCalled();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].id).toBe(666);
            done();
        });
    });

    test('Inserts A User', (done) => {
        userRepository.insert(mockUser).then((result) => {
            expect(mockUserContext.upsert).toBeCalled();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].id).toBe(666);
            done();
        });
    });

    test('Updates A User', (done) => {
        userRepository.update(mockUser).then((result) => {
            expect(mockUserContext.update).toBeCalled();
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].id).toBe(666);
            done();
        });
    });

    test('Deletes A User', (done) => {
        userRepository.delete(1).then((result) => {
            expect(mockUserContext.destroy).toBeCalled();
            expect(result).toBeTruthy();
            done();
        });
    });
});
