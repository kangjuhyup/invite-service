import { removeBackground, Config } from '@imgly/background-removal-node';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class AppService implements OnModuleInit {
  private config: Config;
  async onModuleInit() {
    this.config = {
      debug: false,
      progress: (key, current, total) => {
        const [type, subtype] = key.split(':');
        console.log(
          `${type} ${subtype} ${((current / total) * 100).toFixed(0)}%`,
        );
      },
      model: 'small',
      output: {
        quality: 0.8,
        format: 'image/jpeg', //image/jpeg, image/webp
      },
    };
  }

  getHello(): string {
    return 'Hello World!';
  }

  async removeBackground(file: Express.Multer.File) {
    console.time();
    const before = new Blob([file.buffer], { type: 'image/jpeg' });
    const blob = await removeBackground(before, this.config);

    const buffer = await blob.arrayBuffer();
    const format = this.config.output.format.split('/').pop();
    const fielPath = path.join(__dirname, 'out', file.originalname);
    await fs.mkdir(path.join(__dirname, '/out'), { recursive: true });
    await fs.writeFile(fielPath, Buffer.from(buffer));
    console.timeEnd();
    console.log(`Image saved to ${fielPath}`);
    return Buffer.from(buffer);
  }
}
