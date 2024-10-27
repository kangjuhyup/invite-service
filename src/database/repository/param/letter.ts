import { LetterEntity } from '@database/entity/letter';
import { DefaultParameter } from './default';
import { LetterAttachmentEntity } from '@database/entity/letter.attachment';

export type Letter = Pick<
  LetterEntity,
  'userId' | 'letterCategoryCode' | 'title' | 'body' | 'commentYn' | 'attendYn'
>;

export type LetterAttachment = Pick<
  LetterAttachmentEntity,
  'letterId' | 'attachmentId'
>;

export class InsertLetter extends DefaultParameter {
  letter: Letter;
}
export class InsertLetterAttachment extends DefaultParameter {
  letterAttachments: Array<LetterAttachment>;
}
