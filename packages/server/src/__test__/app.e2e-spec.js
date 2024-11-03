"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../app.module");
const path = require("path");
const fs = require("fs");
const axios_1 = require("axios");
describe('AppController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        common_1.Logger.overrideLogger(['error', 'warn', 'debug']);
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
    describe('회원', () => {
        it('[POST] /auth/signup', () => {
            const body = {
                phone: '01012341234',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(body)
                .expect(201)
                .expect((response) => {
                expect(response.headers['authorization']).toBeDefined();
            })
                .catch((err) => {
                console.error('[POST] /auth/signup 에러');
                throw err;
            });
        });
        it('[POST] /auth/signin (성공)', () => {
            const body = {
                phone: '01012341234',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/auth/signin')
                .send(body)
                .expect(201)
                .expect((response) => {
                expect(response.headers['authorization']).toBeDefined();
            });
        });
        it('[POST] /auth/signin (잘못된 비밀번호)', () => {
            const body = {
                phone: '01012341234',
                password: 'test1111',
            };
            return request(app.getHttpServer())
                .post('/auth/signin')
                .send(body)
                .expect(401)
                .expect((res) => {
                expect(res.body.message).toBe('잘못된 비밀번호 입니다.');
            });
        });
        it('[POST] /auth/signin (없는 유저)', () => {
            const body = {
                phone: '01043214321',
                password: 'test1111',
            };
            return request(app.getHttpServer())
                .post('/auth/signin')
                .send(body)
                .expect(401)
                .expect((res) => {
                expect(res.body.message).toBe('존재하지 않는 회원입니다.');
            });
        });
    });
    describe('초대장', () => {
        let token;
        it('[POST] /auth/signin (Access 토큰 획득)', () => {
            const body = {
                phone: '01012341234',
                password: 'test',
            };
            return request(app.getHttpServer())
                .post('/auth/signin')
                .send(body)
                .expect(201)
                .expect((response) => {
                expect(response.headers['authorization']).toBeDefined();
                token = response.headers['authorization'];
            });
        });
        describe('초대장 업로드', () => {
            const presignedUrls = [];
            let sessionKey;
            it('[POST] /letter/prepare-add (User X )', () => {
                const componentCount = 5;
                const body = {
                    thumbnailMeta: {
                        width: '200',
                        height: '100',
                    },
                    letterMeta: {
                        width: '400',
                        height: '800',
                    },
                    backgroundMeta: {
                        width: '400',
                        height: '800',
                    },
                    componentMetas: Array.from({ length: componentCount }, (_, index) => ({
                        width: '100',
                        height: '50',
                        x: '100',
                        y: '100',
                        z: `${index}`,
                        angle: '0',
                    })),
                };
                return request(app.getHttpServer())
                    .post(`/letter/prepare-add`)
                    .send(body)
                    .expect(401);
            });
            it('[POST] /letter/prepare-add (User O )', () => {
                const componentCount = 5;
                const body = {
                    thumbnailMeta: {
                        width: '200',
                        height: '100',
                    },
                    letterMeta: {
                        width: '400',
                        height: '800',
                    },
                    backgroundMeta: {
                        width: '400',
                        height: '800',
                    },
                    componentMetas: Array.from({ length: componentCount }, (_, index) => ({
                        width: '100',
                        height: '50',
                        x: '100',
                        y: '100',
                        z: `${index}`,
                        angle: '0',
                    })),
                };
                return request(app.getHttpServer())
                    .post(`/letter/prepare-add`)
                    .send(body)
                    .set('Authorization', token)
                    .expect(201)
                    .expect((res) => {
                    expect(res.body.data).toBeDefined();
                    expect(res.body.data.thumbnailUrl).toBeDefined();
                    expect(res.body.data.letterUrl).toBeDefined();
                    expect(res.body.data.backgroundUrl).toBeDefined();
                    expect(res.body.data.componentUrls).toBeDefined();
                    expect(res.body.data.componentUrls).toHaveLength(5);
                    expect(res.body.data.sessionKey).toBeDefined();
                    sessionKey = res.body.data.sessionKey;
                    presignedUrls.push(res.body.data.thumbnailUrl, res.body.data.letterUrl, res.body.data.backgroundUrl, ...res.body.data.componentUrls);
                })
                    .catch((err) => {
                    console.error('[GET] /letter/prepare-add 에러');
                    throw err;
                });
            });
            it('Presigned URL을 사용하여 파일 업로드', async () => {
                const filePath = path.join(__dirname, 'files', 'profile.jpeg');
                for (const url of presignedUrls) {
                    const fileStream = fs.createReadStream(filePath);
                    const { size } = fs.statSync(filePath);
                    const headers = {
                        'Content-Type': 'image/jpeg',
                        'Content-Length': size,
                    };
                    try {
                        const parsedUrl = new URL(url);
                        for (const [key, value] of parsedUrl.searchParams.entries()) {
                            if (key.startsWith('x-amz-meta-')) {
                                headers[key] = value;
                            }
                        }
                        const result = await axios_1.default.put(url, fileStream, {
                            headers,
                        });
                        expect(result.status).toBe(200);
                    }
                    catch (error) {
                        console.error(`Failed to upload to url : ${url} headers : ${JSON.stringify(headers)} error : `, error.message);
                    }
                }
            });
            it('[POST] /letter', () => {
                const body = {
                    category: 'LT001',
                    title: '테스트',
                };
                return request(app.getHttpServer())
                    .post('/letter')
                    .set('Authorization', token)
                    .send(body)
                    .expect(201)
                    .expect((response) => {
                    expect(response.body.data.letterId).toBeDefined();
                })
                    .catch((err) => {
                    console.error(`[POST] /letter Error => `, err.message);
                    throw err;
                });
            });
            it('[GET] /letter', async () => {
                const response = await request(app.getHttpServer())
                    .get('/letter')
                    .set('Authorization', token)
                    .expect(200);
                expect(response.body.data.totalCount).toBeDefined();
                expect(response.body.data.items).toBeDefined();
                const letterId = response.body.data.items[0].id;
                await request(app.getHttpServer())
                    .get(`/letter/${letterId}`)
                    .set('Authorization', token)
                    .expect(200);
            });
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map