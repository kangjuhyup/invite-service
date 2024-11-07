import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LetterEntity } from './letter';
import { DefaultEntity } from './default';
import { UserColumn } from '../column/user.column';

@Entity({ name: UserColumn.table })
export class UserEntity extends DefaultEntity {
  @PrimaryGeneratedColumn('uuid', { name: UserColumn.userId })
  userId: string;

  @Column({ name: UserColumn.nickName })
  nickName: string;

  @Column({ name: UserColumn.phone })
  phone: string;

  @Column({ name: UserColumn.password })
  password: string;

  @Column({name : UserColumn.refreshToken, nullable : true})
  refreshToken? : string;

  @OneToMany(() => LetterEntity, (letter) => letter.user, { nullable: true })
  letter?: LetterEntity[];
}
