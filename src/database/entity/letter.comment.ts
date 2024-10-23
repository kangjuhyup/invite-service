import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LetterEntity } from './letter';
import { LetterCommentColumn } from '@database/column/letter.comment.column';
import { LetterColumn } from '@database/column/letter.column';

@Entity({ name: LetterCommentColumn.table })
export class LetterCommentEntity {
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
    name: LetterCommentColumn.body,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  body: string;

  @ManyToOne(() => LetterEntity, { nullable: false })
  @JoinColumn({ name: LetterColumn.letterId })
  letter: LetterEntity;
}
