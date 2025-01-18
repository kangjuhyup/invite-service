import { StorageService } from '@app/storage/storage.service';
import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BackgroundRemovalService } from './service/bg.removal.service';

@Controller('image')
export class ImageController {

    constructor(
        private readonly storageService: StorageService,
        private readonly backgroundRemovalService: BackgroundRemovalService
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

    @Post('bg-remove')
    @UseInterceptors(FileInterceptor('file'))
    async removeBackground(
        @Res() res: Response,
        @UploadedFile('file') file: Express.Multer.File
    ) {
        const buffer = await this.backgroundRemovalService.removeBackground(file);
        res.send(buffer);
    }
}
