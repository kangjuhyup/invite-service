import { UserEntity } from 'packages/server/src/database/entity/user';
import { Repository } from 'typeorm';
import { InsertUser, SelectUser } from './param/user';
export declare class UserRepository {
    private readonly user;
    constructor(user: Repository<UserEntity>);
    selectUserFromId({ userId, entityManager }: Omit<SelectUser, 'phone'>): Promise<UserEntity>;
    selectUserFromPhone({ phone, entityManager, }: Omit<SelectUser, 'userId'>): Promise<UserEntity>;
    insertUser({ user, creator, entityManager }: InsertUser): Promise<import("typeorm").InsertResult>;
    private _getRepository;
}
