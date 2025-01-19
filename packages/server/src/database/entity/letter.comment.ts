import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LetterEntity } from './letter';
import { LetterColumn } from '../column/letter.column';
import { LetterCommentColumn } from '../column/letter.comment.column';
import { DefaultEntity } from './default';
import { sha256Hash } from '@app/util/crypto';

@Entity({ name: LetterCommentColumn.table })
export class LetterCommentEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({ name: LetterCommentColumn.commentId, type: 'int' })
  letterCommentId: number;

  @Column({ name: LetterColumn.letterId, type: 'int', nullable: false })
  letterId: number;

  @Column({
    name: LetterCommentColumn.editor,
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  editor: string;

  @Column({
    name: LetterCommentColumn.password,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    name: LetterCommentColumn.body,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  body: string;

  @ManyToOne(() => LetterEntity, { nullable: false })
  @JoinColumn({ name: LetterColumn.letterId })
  letter: LetterEntity;

  static of(letterId: number, password: string, editor: string, body: string, creator:string): LetterCommentEntity {
    const comment = new LetterCommentEntity();
    comment.letterId = letterId;
    comment.password = sha256Hash(password);
    comment.editor = editor;
    comment.body = body;
    comment.creator = creator;
    comment.updator = creator;
    return comment;
  }

  verifyPassword(password: string): boolean {
    return this.password === sha256Hash(password);
  }
}
