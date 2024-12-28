import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('WASABI_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('WASABI_SECRET_KEY'),
      },
      region: this.configService.get<string>('WASABI_REGION'),
      endpoint: this.configService.get<string>('WASABI_ENDPOINT'),
      forcePathStyle: true,
    });
  }

  async generateUploadPresignedUrl(param: {
    bucket: string;
    key: string;
    expires: number;
    meta?: any;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: param.bucket,
      Key: param.key,
      ContentType: 'image/png',
      Metadata: {
        ...param.meta,
      },
    });
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: param.expires,
    });
  }

  async generateDownloadPresignedUrl(param: {
    bucket: string;
    key: string;
    expires: number;
  }): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: param.bucket,
      Key: param.key,
    });
    return await getSignedUrl(this.s3Client, command, {
      expiresIn: param.expires,
    });
  }

  async getObjectMetadata(param: {
    bucket: string;
    key: string;
  }): Promise<any> {
    const command = new HeadObjectCommand({
      Bucket: param.bucket,
      Key: param.key,
    });
    try {
      const metadata = await this.s3Client.send(command);
      return metadata;
    } catch (err: any) {
      if (err.name === 'NotFound') {
        return undefined;
      }
      throw err;
    }
  }

  async deleteObject(param: { bucket: string; key: string }): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: param.bucket,
      Key: param.key,
    });
    try {
      await this.s3Client.send(command);
    } catch (err: any) {
      if (err.name !== 'NotFound') {
        throw err;
      }
    }
  }
}
