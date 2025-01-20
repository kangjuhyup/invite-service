import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Config, removeBackground } from '@imgly/background-removal-node';

@Injectable()
export class BackgroundRemovalService implements OnModuleInit {
    private logger = new Logger(BackgroundRemovalService.name);
    private config: Config;
    
    onModuleInit() {
        const modelsPath = path.join(process.cwd(), 'public','models');
        this.config = {
            debug: false,
            progress: (key, current, total) => {
                const [type, subtype] = key.split(':');
                this.logger.debug(
                    `${type} ${subtype} ${((current / total) * 100).toFixed(0)}%`,
                );
            },
            publicPath: `file://${path.resolve(modelsPath)}`,
            model: 'small',
            output: {
                quality: 0.8,
                format: 'image/webp', //image/jpeg, image/webp
            },
        };
        
        this.logger.debug(`모델 경로: ${this.config.publicPath}`);
    }

    async removeBackground(file: Express.Multer.File) {
        this.logger.debug('배경 제거 시작');
        const startTime = Date.now();
        const before = new Blob([file.buffer], { type: 'image/jpeg' });
        const blob = await removeBackground(before, this.config).catch((e) => {
            this.logger.error(e);
            throw e;
        });
    
        const buffer = await blob.arrayBuffer();
        const endTime = Date.now();
        this.logger.debug(`배경 제거 완료: ${endTime - startTime}ms`);
        return Buffer.from(buffer);
    }
}