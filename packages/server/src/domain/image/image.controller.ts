import { StorageService } from '@app/storage/storage.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('image')
export class ImageController {

    constructor(
        private readonly storageService: StorageService,
    ) {}

    @Get(':bucket/:id')
    async redirectPresignedUrl(
        @Param('bucket') bucket: string,
        @Param('id') id: string,
    ) {
        return {
            result : true,
            data : await this.storageService.generateDownloadPresignedUrl({
                bucket,
                key: id,
                expires: 60,
            })
        };
    }
}
