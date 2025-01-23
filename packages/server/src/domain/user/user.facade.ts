import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UpdateProfileRequest } from './dto/request/update.profile';
import { User } from '@app/jwt/user';
import { GetMyProfileResponse } from './dto/response/get.profile';
import { StorageService } from '@app/storage/storage.service';
import { randomString } from '@app/util/random';
import { v4 as uuidv4 } from 'uuid';
import { UserAttachmentService } from './service/user.attachment.service';
import { PrepareImageResponse } from './dto/response/prepare.image';
import { RedisClientService } from '@app/redis/redis.client.service';
import { InsertImageTransaction } from './transaction/insert.image';

@Injectable()
export class UserFacade {
  constructor(
    private readonly user: UserService,
    private readonly userAttachment: UserAttachmentService,
    private readonly storage: StorageService,
    private readonly redis: RedisClientService,
    private readonly insertImageTransaction: InsertImageTransaction,
  ) {}

  async getMyProfile(user: User) {
    return GetMyProfileResponse.of(
      await this.user.getUser({ userId: user.id }),
    );
  }

  async updateProfile(dto: UpdateProfileRequest, user: User) {
    return this.user.updateProfile({ userId: user.id, ...dto });
  }

  async getProfilePresignedUrl(user: User) {
    const uuid = uuidv4();
    const sessionKey = randomString(5);
    const url = await this.storage.generateUploadPresignedUrl({
      type: 'image',
      bucket: this.userAttachment.profileBucket,
      key: uuid,
      expires: this.userAttachment.urlExpires,
      meta: { userId: user.id, uuid, sessionKey },
    });
    await this.redis.set(this.redis.generateKey(UserFacade.name, `profile-${user.id}`), {
      sessionKey,
      objectKey : uuid
    })
    return PrepareImageResponse.of(url, sessionKey, this.userAttachment.urlExpires);
  }

  async validateProfileImage(   
    user : User
  ) {
    const session = await this.redis.get<{ sessionKey: string; objectKey: string }>(this.redis.generateKey(UserFacade.name, `profile-${user.id}`));
    if (!session) throw new BadRequestException('필수 요청이 누락되었습니다.');
    const meta = await this.storage.getObjectMetadata({
        bucket : this.userAttachment.profileBucket,
        key : session.objectKey
    })
    if (!meta) throw new BadRequestException('메타데이터가 존재하지 않습니다.');
    await this.insertImageTransaction.run({
      userId: user.id,
      attachmentPath: session.objectKey,
    })
    await this.redis.delete(this.redis.generateKey(UserFacade.name, `profile-${user.id}`))
  }
}
