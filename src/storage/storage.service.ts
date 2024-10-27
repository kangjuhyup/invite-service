import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('WASABI_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('WASABI_SECRET_KEY'),
      region: this.configService.get<string>('WASABI_REGION'),
      endpoint: this.configService.get<string>('WASABI_ENDPOINT'),
      s3ForcePathStyle: true,
    });
  }

  async generateUploadPresignedUrl(param: {
    bucket: string;
    key: string;
    expires: number;
  }): Promise<string> {
    const params = {
      Bucket: param.bucket,
      Key: param.key,
      Expires: param.expires,
      ContentType: 'application/octet-stream',
    };

    return await this.s3.getSignedUrlPromise('putObject', params);
  }

  async generateDownloadPresignedUrl(param: {
    bucket: string;
    key: string;
    expires: number;
  }): Promise<string> {
    const params = {
      Bucket: param.bucket,
      Key: param.key,
      Expires: param.expires,
    };

    return await this.s3.getSignedUrlPromise('getObject', params);
  }

  async getObjectMetadata(param: {
    bucket: string;
    key: string;
  }): Promise<AWS.S3.HeadObjectOutput> {
    const params = {
      Bucket: param.bucket,
      Key: param.key,
    };

    const metadata = await this.s3
      .headObject(params)
      .promise()
      .catch((err) => {
        if (err.statusCode == 404) {
          return undefined;
        }
        throw err;
      });
    return metadata;
  }

  async deleteObject(param: { bucket: string; key: string }): Promise<void> {
    const params = {
      Bucket: param.bucket,
      Key: param.key,
    };

    await this.s3
      .deleteObject(params)
      .promise()
      .catch((err) => {
        if (err.statusCode === 404) {
          console.log('Object not found, nothing to delete.');
          return;
        }
        throw err;
      });
  }
}
