import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetLetterPageRequest } from '../get.page';

describe('GetLetterPageRequest DTO Validation', () => {
  it('should validate a valid DTO with only required fields', async () => {
    const dto = plainToInstance(GetLetterPageRequest, { limit: 10 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid DTO with all fields', async () => {
    const dto = plainToInstance(GetLetterPageRequest, { limit: 10, skip: 20 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when limit is missing', async () => {
    const dto = plainToInstance(GetLetterPageRequest, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail when limit is not a number', async () => {
    const dto = plainToInstance(GetLetterPageRequest, {
      limit: 'not-a-number',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should transform string numbers to numbers', async () => {
    const dto = plainToInstance(GetLetterPageRequest, {
      limit: '10',
      skip: '20',
    });
    expect(typeof dto.limit).toBe('number');
    expect(typeof dto.skip).toBe('number');
    expect(dto.limit).toBe(10);
    expect(dto.skip).toBe(20);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when skip is not provided', async () => {
    const dto = plainToInstance(GetLetterPageRequest, { limit: 10 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when skip is not a number', async () => {
    const dto = plainToInstance(GetLetterPageRequest, {
      limit: 10,
      skip: 'not-a-number',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('skip');
  });
});
