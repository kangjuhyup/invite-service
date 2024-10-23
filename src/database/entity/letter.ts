import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from './default';
import { LetterCategoryCode } from '@util/category';
import { YN } from '@util/yn';
import { UserEntity } from './user';
import { LetterCategoryEntity } from './letter.cateogry';
import { LetterCommentEntity } from './letter.comment';
import { LetterAttachmentEntity } from './letter.attachment';
import { LetterTotalEntity } from './letter.total';
import { LetterColumn } from '@database/column/letter.column';
import { UserColumn } from '@database/column/user.column';
import { LetterCategoryColumn } from '@database/column/letter.category.column';

@Entity({ name: LetterColumn.table })
export class LetterEntity extends DefaultEntity {
  @PrimaryGeneratedColumn('increment', {
    name: LetterColumn.letterId,
    type: 'int',
  })
  letterId: number;
  @Column({
    name: UserColumn.userId,
    type: 'char',
    length: 36,
    nullable: false,
  })
  userId: string;

  @Column({
    name: LetterCategoryColumn.letterCategoryCode,
    type: 'char',
    length: 5,
    nullable: false,
  })
  letterCategoryCode: LetterCategoryCode;

  @Column({
    name: LetterColumn.title,
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  title: string;

  @Column({
    name: LetterColumn.body,
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  body?: string;

  @Column({
    name: LetterColumn.commentYn,
    type: 'char',
    length: 1,
    nullable: false,
    default: YN.N,
  })
  commentYn: YN;

  @Column({
    name: LetterColumn.attendYn,
    type: 'char',
    length: 1,
    nullable: false,
    default: YN.N,
  })
  attendYn: YN;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: UserColumn.userId })
  user: UserEntity;

  @ManyToOne(() => LetterCategoryEntity, { nullable: false })
  @JoinColumn({ name: LetterCategoryColumn.letterCategoryCode })
  letterCategory: LetterCategoryEntity;

  @OneToMany(
    () => LetterCommentEntity,
    (letterComment) => letterComment.letter,
    { nullable: true },
  )
  letterComment?: LetterCommentEntity[];

  @OneToMany(
    () => LetterAttachmentEntity,
    (letterAttachment) => letterAttachment.letter,
    { nullable: false },
  )
  letterAttachment: LetterAttachmentEntity[];

  @OneToOne(() => LetterTotalEntity, { nullable: false })
  letterTotal: LetterTotalEntity;
}
