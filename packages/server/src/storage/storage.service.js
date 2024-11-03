"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: this.configService.get('WASABI_ACCESS_KEY'),
                secretAccessKey: this.configService.get('WASABI_SECRET_KEY'),
            },
            region: this.configService.get('WASABI_REGION'),
            endpoint: this.configService.get('WASABI_ENDPOINT'),
            forcePathStyle: true,
        });
    }
    async generateUploadPresignedUrl(param) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: param.bucket,
            Key: param.key,
            ContentType: 'application/octet-stream',
            Metadata: {
                session: param.meta.session,
                width: '100',
                height: '100',
            },
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: param.expires,
        });
    }
    async generateDownloadPresignedUrl(param) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: param.bucket,
            Key: param.key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
            expiresIn: param.expires,
        });
    }
    async getObjectMetadata(param) {
        const command = new client_s3_1.HeadObjectCommand({
            Bucket: param.bucket,
            Key: param.key,
        });
        try {
            const metadata = await this.s3Client.send(command);
            return metadata;
        }
        catch (err) {
            if (err.name === 'NotFound') {
                return undefined;
            }
            throw err;
        }
    }
    async deleteObject(param) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: param.bucket,
            Key: param.key,
        });
        try {
            await this.s3Client.send(command);
        }
        catch (err) {
            if (err.name !== 'NotFound') {
                throw err;
            }
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map