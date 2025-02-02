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
    type: 'int',
    nullable: false,
    default: 0,
  })
  angle: number;
  @Column({ name: MetadataColumn.width, type: 'int', nullable: false })
  width: number;
  @Column({ name: MetadataColumn.height, type: 'int', nullable: false })
  height: number;
  @Column({
    name: MetadataColumn.x,
    type: 'int',
    nullable: false,
    default: 0,
  })
  x: number;
  @Column({
    name: MetadataColumn.y,
    type: 'int',
    nullable: false,
    default: 0,
  })
  y: number;

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
    angle: number,
    width: number,
    height: number,
    x: number,
    y: number,
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
