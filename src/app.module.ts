import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LetterModule } from './domain/letter/letter.module';

const routers = [
  LetterModule
]

@Module({
  imports: [...routers],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
