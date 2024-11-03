import { UserEntity } from 'packages/server/src/database/entity/user';
import { UserRepository } from 'packages/server/src/database/repository/user';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getUser(param: {
        phone?: string;
        userId?: string;
    }): Promise<UserEntity>;
    saveUser(phone: string, pwd: string): Promise<UserEntity>;
}
