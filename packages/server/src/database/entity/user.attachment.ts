import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { AttachmentColumn } from '../column/attachment.column';
import { UserEntity } from './user';
import { UserColumn } from '../column/user.column';
import { AttachmentEntity } from './attachment';
import { UserAttachmentColumn } from '../column/user.attachment.column';

@Entity({ name: UserAttachmentColumn.table })
export class UserAttachmentEntity extends DefaultEntity {
  @PrimaryColumn({ name: UserColumn.userId, type: 'int' })
  userId: number;

  @PrimaryColumn({
    name: UserAttachmentColumn.attachmentCode,
    type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
    length: 5,
  })
  attachmentCode: string;

  @PrimaryColumn({ name: AttachmentColumn.attachmentId, type: 'int' })
  attachmentId: number;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: UserColumn.userId })
  user: UserEntity;

  @ManyToOne(() => AttachmentEntity, { nullable: false })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  attachment: AttachmentEntity;
}
