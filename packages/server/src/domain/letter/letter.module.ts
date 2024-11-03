import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './service/letter.service';
import { InsertLetterTransaction } from './transaction/insert.letter';
import { LetterAttachmentService } from './service/letter.attachment.service';

const transactions = [InsertLetterTransaction];

@Module({
  controllers: [LetterController],
  providers: [LetterService, LetterAttachmentService, ...transactions],
})
export class LetterModule {}
