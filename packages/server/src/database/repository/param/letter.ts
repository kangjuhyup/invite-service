import { LetterEntity } from '@app/database/entity/letter';
import { LetterAttachmentEntity } from '@app/database/entity/letter.attachment';
import { LetterCategoryCode } from '@app/util/category';
import { DefaultParameter } from './default';

export type Letter = Pick<
  LetterEntity,
  | 'userId'
  | 'letterCategoryCode'
  | 'title'
  | 'body'
  | 'commentYn'
  | 'attendYn'
  | 'creator'
  | 'updator'
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
  | 'creator'
  | 'updator'
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
