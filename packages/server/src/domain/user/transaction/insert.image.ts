import { AttachmentEntity } from '@app/database/entity/attachment';
import { UserAttachmentEntity } from '@app/database/entity/user.attachment';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { UserRepository } from '@app/database/repository/user';
import { BaseTransaction } from '@app/database/transaction.base';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export type ProfileImageDetail = Pick<AttachmentEntity, 'attachmentPath'>;

interface Input {
  userId: string;
  attachmentPath: string;
}

@Injectable()
export class InsertImageTransaction extends BaseTransaction<Input, number> {
  private readonly creator = InsertImageTransaction.name;
  constructor(
    private readonly ds: DataSource,
    private readonly userRepository: UserRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(ds);
  }

  protected async execute(
    { userId, attachmentPath }: Input,
    manager: EntityManager,
  ): Promise<number> {
    const result = await this.attachmentRepository.insertAttachment({
      attachment: {
        attachmentPath: `prf/${attachmentPath}`,
        creator: this.creator,
        updator: this.creator,
      },
      entityManager: manager,
    });
    const attachmentId = result.identifiers[0].attachmentId;
    const userAttachment = UserAttachmentEntity.of(
      userId,
      'PF001',
      attachmentId,
      this.creator,
    );
    await this.userRepository.upsertUserProfileImage({
      userAttachment,
      entityManager: manager,
    });
    return;
  }
}
