import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
import { LetterColumn } from '../column/letter.column';
import { LetterTotalColumn } from '../column/letter.total.column';

@Entity({ name: LetterTotalColumn.table })
export class LetterTotalEntity extends DefaultEntity {
  @PrimaryColumn({ name: LetterColumn.letterId, type: 'int' })
  letterId: number;

  @Column({ name: LetterTotalColumn.attendantcount, type: 'int', default: 0 })
  attendantCount: number;

  @Column({ name: LetterTotalColumn.viewCount, type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: LetterTotalColumn.commentCount, type: 'int', default: 0 })
  commentCount: number;

  @OneToOne(() => LetterEntity, { nullable: false })
  letter: LetterEntity;
}
