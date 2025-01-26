import { validate } from 'class-validator';
import { ModifyLetterRequest } from '../modify.letter';
import { plainToInstance } from 'class-transformer';

describe('ModifyLetterRequest', () => {
  let dto: ModifyLetterRequest;

  beforeEach(() => {
    dto = new ModifyLetterRequest();
  });

  describe('title 필드 테스트', () => {
    it('title이 20자 이하일 때 유효해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        title: '테스트 제목',
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('title이 20자 초과일 때 에러가 발생해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        title: '이것은아주아주아주아주아주아주긴제목입니다',
      });
      const errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('title이 문자열이 아닐 때 에러가 발생해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        title: 123,
      });
      const errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('body 필드 테스트', () => {
    it('body가 255자 이하일 때 유효해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        body: '테스트 본문',
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('body가 255자 초과일 때 에러가 발생해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        body: 'a'.repeat(256),
      });
      const errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('boolean 필드 테스트', () => {
    it('commentYn이 boolean 타입일 때 유효해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        commentYn: true,
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('attendYn이 boolean 타입일 때 유효해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        attendYn: false,
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('publicYn이 boolean 타입일 때 유효해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        publicYn: true,
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('boolean 필드가 boolean이 아닐 때 에러가 발생해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        commentYn: 'true', // 문자열로 전달
        attendYn: 1,      // 숫자로 전달
        publicYn: {},     // 객체로 전달
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(3);
      errors.forEach(error => {
        expect(error.constraints).toHaveProperty('isBoolean');
      });
    });
  });

  describe('전체 필드 테스트', () => {
    it('모든 필드가 유효할 때 검증을 통과해야 합니다', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {
        title: '테스트 제목',
        body: '테스트 본문',
        commentYn: true,
        attendYn: false,
        publicYn: true,
      });
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });

    it('모든 필드가 없어도 검증을 통과해야 합니다 (선택적 필드)', async () => {
      const testDto = plainToInstance(ModifyLetterRequest, {});
      const errors = await validate(testDto);
      expect(errors.length).toBe(0);
    });
  });
});
