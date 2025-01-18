import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { StorageModule } from '@app/storage/storage.module';
import { BackgroundRemovalService } from './service/bg.removal.service';

@Module({
    imports : [
        StorageModule,
    ], 
  controllers: [ImageController],
  providers: [BackgroundRemovalService],
  exports : [
    BackgroundRemovalService
  ]
})
export class ImageModule {}
