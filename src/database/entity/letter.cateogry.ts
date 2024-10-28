import { LetterCategory, LetterCategoryCode } from '@util/category';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
import { LetterCategoryColumn } from '@database/column/letter.category.column';

@Entity({ name: LetterCategoryColumn.table })
export class LetterCategoryEntity extends DefaultEntity {
  @PrimaryColumn({
    name: LetterCategoryColumn.letterCategoryCode,
    type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
    length: 5,
  })
  letterCategoryCode: LetterCategoryCode;

  @Column({
    name: LetterCategoryColumn.letterCategoryDetail,
    type: 'varchar',
    length: 20,
  })
  letterCategoryDetail: LetterCategory;

  @OneToMany(() => LetterEntity, (letter) => letter.letterCategory, {
    nullable: true,
  })
  letter?: LetterEntity[];
}
