import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './service/letter.service';
import { InsertLetterTransaction } from './transaction/insert.letter';
import { LetterAttachmentService } from './service/letter.attachment.service';
import { LetterFacade } from './letter.facade';
import { CommentService } from '../comment/service/comment.service';
import { CommentModule } from '../comment/comment.module';

const transactions = [
  InsertLetterTransaction,
];
const services = [LetterService, LetterAttachmentService];

@Module({
  imports : [
    CommentModule,
  ],
  controllers: [LetterController],
  providers: [LetterFacade, ...services, ...transactions],
  exports: [LetterFacade],
})
export class LetterModule {}
