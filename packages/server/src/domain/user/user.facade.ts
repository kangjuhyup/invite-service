import { Injectable } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UpdateProfileRequest } from './dto/request/update.profile';
import { User } from '@app/jwt/user';
import { GetMyProfileResponse } from './dto/response/get.profile';
import { StorageService } from '@app/storage/storage.service';

@Injectable()
export class UserFacade {
  constructor(
    private readonly user: UserService,
    private readonly storage: StorageService,
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
    return this.storage.generateUploadPresignedUrl({
      type: 'image',
      bucket: 'profile',
      key: user.id,
      expires: 3600,
      meta: { userId: user.id },
    });
  }
}
