import { validate } from 'class-validator';
import { AddLetterRequest } from '../add.letter';
import { LetterCategoryCode } from '@app/util/category';

describe('AddLetterRequest DTO Validation', () => {
  let dto: AddLetterRequest;

  beforeEach(() => {
    dto = new AddLetterRequest();
  });

  it('should validate a valid DTO', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;
    dto.title = 'Valid Title';
    dto.body = 'Valid body text';
    dto.commentYn = true;
    dto.attendYn = false;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when category is missing', async () => {
    dto.title = 'Valid Title';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('category');
  });

  it('should fail when title is missing', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when title exceeds max length', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;
    dto.title = 'This title is way too long and should fail validation';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when body exceeds max length', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;
    dto.title = 'Valid Title';
    dto.body = 'A'.repeat(256); // 255 characters is the max

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('body');
  });

  it('should fail when category is invalid', async () => {
    dto.category = 'INVALID_CATEGORY' as LetterCategoryCode;
    dto.title = 'Valid Title';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('category');
  });

  it('should validate when optional fields are not provided', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;
    dto.title = 'Valid Title';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when commentYn and attendYn are provided with valid boolean values', async () => {
    dto.category = LetterCategoryCode.ANNIVERSARY;
    dto.title = 'Valid Title';
    dto.commentYn = true;
    dto.attendYn = false;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
