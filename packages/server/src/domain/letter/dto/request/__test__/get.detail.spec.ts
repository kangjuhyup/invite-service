import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetLetterDetailRequest } from '../get.detail';

describe('GetLetterDetailRequest DTO Validation', () => {
  it('should validate a valid DTO', async () => {
    const dto = plainToInstance(GetLetterDetailRequest, { id: 1 });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when id is missing', async () => {
    const dto = plainToInstance(GetLetterDetailRequest, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('id');
  });

  it('should fail when id is not a number', async () => {
    const dto = plainToInstance(GetLetterDetailRequest, { id: 'not-a-number' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('id');
  });

  it('should transform string number to number', async () => {
    const dto = plainToInstance(GetLetterDetailRequest, { id: '123' });
    expect(typeof dto.id).toBe('number');
    expect(dto.id).toBe(123);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
