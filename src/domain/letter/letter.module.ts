import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { InsertLetterTrasnaction } from './transaction/insert.letter';

const transactions = [
  InsertLetterTrasnaction,
]

@Module({
  controllers: [LetterController],
  providers: [LetterService,...transactions],
})
export class LetterModule {}
