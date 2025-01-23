import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserFacade],
  exports: [UserService],
})
export class UserModule {}
