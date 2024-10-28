import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { YN } from '@util/yn';
import { DefaultColumn } from '@database/column/default';

export class DefaultEntity {
  @Column({
    name: DefaultColumn.useYn,
    type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
    length: 1,
    default: YN.Y,
  })
  useYn: YN;

  @Column({ name: DefaultColumn.creator, type: 'varchar', length: 20 })
  creator: string;

  @CreateDateColumn({ name: DefaultColumn.createdAt, type: 'datetime' })
  createdAt: Date;

  @Column({ name: DefaultColumn.updator, type: 'varchar', length: 20 })
  updator: string;

  @UpdateDateColumn({ name: DefaultColumn.updatedAt, type: 'datetime' })
  updatedAt: Date;
}
