import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';
import { UserAttachmentService } from './service/user.attachment.service';
import { InsertImageTransaction } from './transaction/insert.image';

const services = [UserService, UserAttachmentService];
const transactions = [InsertImageTransaction];

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...services, ...transactions, UserFacade],
  exports: [...services],
})
export class UserModule {}
