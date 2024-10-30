import { LetterEntity } from '@database/entity/letter';
import { DefaultParameter } from './default';
import { LetterAttachmentEntity } from '@database/entity/letter.attachment';
import { LetterCategoryCode } from '@util/category';

export type Letter = Pick<
  LetterEntity,
  'userId' | 'letterCategoryCode' | 'title' | 'body' | 'commentYn' | 'attendYn'
>;

export type LetterAttachment = Pick<
  LetterAttachmentEntity,
  | 'letterId'
  | 'attachmentId'
  | 'attachmentCode'
  | 'angle'
  | 'width'
  | 'height'
  | 'x'
  | 'y'
  | 'z'
>;

export class SelectLetter extends DefaultParameter {
  userId: string;
  letterId: number;
  letterIds: number[];
  category: LetterCategoryCode;
  limit?: number;
  skip?: number;
}

export class InsertLetter extends DefaultParameter {
  letter: Letter;
}
export class InsertLetterAttachment extends DefaultParameter {
  letterAttachments: Array<LetterAttachment>;
}
