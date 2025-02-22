import { AttachmentColumn } from '@app/database/column/attachment.column';
import { MetadataColumn } from '@app/database/column/metadata.column';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from '../default';
import { AttachmentEntity } from './attachment';

@Entity({ name: MetadataColumn.table })
export class MetadataEntity extends DefaultEntity {
  @PrimaryColumn({ name: AttachmentColumn.attachmentId })
  attachmentId: number;

  @Column({
    name: MetadataColumn.angle,
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: false,
    default: 0,
  })
  angle: string;
  @Column({ name: MetadataColumn.width, type: 'int', nullable: false })
  width: number;
  @Column({ name: MetadataColumn.height, type: 'int', nullable: false })
  height: number;
  @Column({
    name: MetadataColumn.x,
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: false,
    default: 0,
  })
  x: string;
  @Column({
    name: MetadataColumn.y,
    type: 'decimal',
    precision: 40,
    scale: 20,
    nullable: false,
    default: 0,
  })
  y: string;

  @Column({
    name: MetadataColumn.z,
    type: 'int',
    nullable: false,
    default: 0,
  })
  z: number;

  @Column({
    name: MetadataColumn.font,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  font?: string;

  @Column({
    name: MetadataColumn.color,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  color?: string;

  @Column({
    name: MetadataColumn.bold,
    type: 'boolean',
    nullable: true,
  })
  bold?: boolean;

  @OneToOne(() => AttachmentEntity, attachment => attachment.metadata)
  attachment: AttachmentEntity;

  static of(
    creator: string,
    attachmentId: number,
    angle: string,
    width: number,
    height: number,
    x: string,
    y: string,
    z: number,
    font?: string,
    color?: string,
    bold?: boolean,
  ) {
    const metadata = new MetadataEntity();
    metadata.attachmentId = attachmentId;
    metadata.angle = angle;
    metadata.width = width;
    metadata.height = height;
    metadata.x = x;
    metadata.y = y;
    metadata.z = z;
    metadata.font = font;
    metadata.color = color;
    metadata.bold = bold;
    metadata.creator = creator;
    metadata.updator = creator;
    return metadata;
  }
}
