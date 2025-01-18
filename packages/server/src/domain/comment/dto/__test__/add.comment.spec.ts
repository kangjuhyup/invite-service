import { validate } from 'class-validator';
import { AddCommentRequest } from '../add.comment';

describe('AddCommentRequest', () => {
    let dto: AddCommentRequest;

    beforeEach(() => {
        dto = new AddCommentRequest();
        dto.editor = '홍길동';
        dto.content = '축하드립니다!';
        dto.password = 'password123';
    });

    it('should pass validation with valid data', async () => {
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    describe('editor validation', () => {
        it('should fail when editor is empty', async () => {
            dto.editor = '';
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('minLength');
        });

        it('should fail when editor exceeds max length', async () => {
            dto.editor = 'a'.repeat(21);
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('maxLength');
        });

        it('should fail when editor is not string', async () => {
            (dto as any).editor = 123;
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isString');
        });
    });

    describe('content validation', () => {
        it('should fail when content is too short', async () => {
            dto.content = '1234';
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('minLength');
        });

        it('should fail when content exceeds max length', async () => {
            dto.content = 'a'.repeat(101);
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('maxLength');
        });

        it('should fail when content is not string', async () => {
            (dto as any).content = 123;
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isString');
        });
    });

    describe('password validation', () => {
        it('should fail when password is empty', async () => {
            dto.password = '';
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('minLength');
        });

        it('should fail when password exceeds max length', async () => {
            dto.password = 'a'.repeat(21);
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('maxLength');
        });

        it('should fail when password is not string', async () => {
            (dto as any).password = 123;
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isString');
        });
    });

    describe('multiple field validation', () => {
        it('should fail when multiple fields are invalid', async () => {
            dto.editor = '';
            dto.content = '1234';
            dto.password = 'a'.repeat(21);
            
            const errors = await validate(dto);
            expect(errors.length).toBe(3);
        });
    });
});
