"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const storage_service_1 = require("../storage.service");
describe('StorageService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [config_1.ConfigModule.forRoot()],
            providers: [storage_service_1.StorageService],
        }).compile();
        service = module.get(storage_service_1.StorageService);
    });
    describe('Storage 통합 테스트', () => {
        it('Presigned Url 생성', async () => {
            const url = await service.generateUploadPresignedUrl({
                bucket: 'thm',
                key: 'test-key',
                expires: 3600,
                meta: {
                    session: 'test',
                    width: 100,
                    height: 100,
                },
            });
            expect(url).toContain('https://');
            expect(url).toContain('test-key');
        });
    });
});
//# sourceMappingURL=storage.intergration.spec.js.map