import { YN } from '@app/util/yn';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DefaultColumn } from '../column/default';

export class DefaultEntity {
  @Column({
    name: DefaultColumn.useYn,
    type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
    length: 1,
    default: YN.Y,
  })
  useYn: YN;

  @Column({ name: DefaultColumn.creator, type: 'varchar', length: 255 })
  creator: string;

  @CreateDateColumn({ name: DefaultColumn.createdAt, type: 'datetime' })
  createdAt: Date;

  @Column({ name: DefaultColumn.updator, type: 'varchar', length: 255 })
  updator: string;

  @UpdateDateColumn({ name: DefaultColumn.updatedAt, type: 'datetime' })
  updatedAt: Date;
}
