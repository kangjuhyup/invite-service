import { UserEntity } from "@database/entity/user";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { InsertUser, SelectUser } from "./param/user";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity) private readonly user : Repository<UserEntity>
    ) {}

    async selectUserFromPhone({phone,entityManager}:Omit<SelectUser,'userId'>) {
        const repo = this._getRepository('user',entityManager);
        return await repo.findOne({
            where : {
                phone
            }
        })
    }

    async insertUser({user,entityManager}:InsertUser) {
        const repo = this._getRepository('user',entityManager);
        return await repo.insert(user);
    }

    private _getRepository(type: 'user', entityManager?: EntityManager) {
        if (type === 'user')
          return entityManager
            ? entityManager.getRepository(UserEntity)
            : this.user;
      }
}