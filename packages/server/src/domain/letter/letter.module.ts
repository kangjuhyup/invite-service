import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './service/letter.service';
import { InsertLetterTransaction } from './transaction/insert.letter';
import { LetterAttachmentService } from './service/letter.attachment.service';
import { LetterFacade } from './letter.facade';

const transactions = [InsertLetterTransaction];
const services = [LetterService, LetterAttachmentService];

@Module({
  controllers: [LetterController],
  providers: [LetterFacade, ...services, ...transactions],
})
export class LetterModule {}
