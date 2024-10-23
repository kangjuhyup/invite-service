import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LetterEntity } from './letter';
import { UserColumn } from '@database/column/user.column';

@Entity({ name: UserColumn.table })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: UserColumn.userId })
  userId: string;

  @OneToMany(() => LetterEntity, (letter) => letter.user, { nullable: true })
  letter?: LetterEntity[];
}
