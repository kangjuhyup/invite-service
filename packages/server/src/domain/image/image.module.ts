import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { StorageModule } from '@app/storage/storage.module';

@Module({
    imports : [
        StorageModule,
    ], 
  controllers: [ImageController],
})
export class ImageModule {}
