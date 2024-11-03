"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_1 = require("../../entity/user");
const typeorm_1 = require("@nestjs/typeorm");
const user_2 = require("../user");
const letter_1 = require("../../entity/letter");
const letter_attachment_1 = require("../../entity/letter.attachment");
const attachment_1 = require("../../entity/attachment");
const letter_cateogry_1 = require("../../entity/letter.cateogry");
const letter_comment_1 = require("../../entity/letter.comment");
const letter_total_1 = require("../../entity/letter.total");
describe('UserRepository', () => {
    let userRepository;
    let module;
    beforeAll(async () => {
        const entities = [
            user_1.UserEntity,
            letter_1.LetterEntity,
            letter_cateogry_1.LetterCategoryEntity,
            letter_comment_1.LetterCommentEntity,
            letter_total_1.LetterTotalEntity,
            letter_attachment_1.LetterAttachmentEntity,
            attachment_1.AttachmentEntity,
        ];
        module = await testing_1.Test.createTestingModule({
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities,
                    synchronize: true,
                }),
                typeorm_1.TypeOrmModule.forFeature(entities),
            ],
            providers: [user_2.UserRepository],
        }).compile();
        userRepository = module.get(user_2.UserRepository);
    });
    afterAll(async () => {
        await module.close();
    });
    describe('selectUserFromPhone', () => {
        it('should return a user by phone', async () => {
            const userData = {
                user: { nickName: 'John', phone: '01012341234', password: 'test123' },
                creator: 'test',
            };
            await userRepository.insertUser({ ...userData });
            const foundUser = await userRepository.selectUserFromPhone({
                phone: '01012341234',
            });
            expect(foundUser).toBeDefined();
            expect(foundUser.phone).toBe(userData.user.phone);
            expect(foundUser.nickName).toBe(userData.user.nickName);
        });
        it('should return undefined if user does not exist', async () => {
            const foundUser = await userRepository.selectUserFromPhone({
                phone: 'nonexistent',
            });
            expect(foundUser).toBeNull();
        });
    });
    describe('insertUser', () => {
        it('should insert a user and return the generated ID', async () => {
            const userData = {
                user: { nickName: 'Jane', phone: '01098765432', password: 'password' },
                creator: 'test',
            };
            const result = await userRepository.insertUser({
                ...userData,
            });
            expect(result).toBeDefined();
            expect(result.identifiers.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=user.repository.spec.js.map