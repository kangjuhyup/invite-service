import { LetterEntity } from '@app/database/entity/letter';
import { LetterAttachmentEntity } from '@app/database/entity/letter.attachment';
import { LetterCategoryCode } from '@app/util/category';
import { DefaultParameter } from './default';
import { LetterCommentEntity } from '@app/database/entity/letter.comment';

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

export class UpdateLetter extends DefaultParameter {
  letterId: number;
  updator: string;
  title?: string;
  body?: string;
  commentYn?: boolean;
  attendYn?: boolean;
  publicYn?: boolean;
  password: string;
}

export class DeleteLetter extends DefaultParameter {
  letterId: number;
}

export class InsertLetterAttachment extends DefaultParameter {
  letterAttachments: Array<LetterAttachment>;
}

export class DeleteLetterAttachment extends DefaultParameter {
  letterId: number;
  attachmentId: number;
}

export class InsertComment extends DefaultParameter {
  comment: LetterCommentEntity;
}

export class SelectComment extends DefaultParameter {
  letterId: number;
  letterCommentId: number;
}

export class DeleteComment extends DefaultParameter {
  letterCommentId: number;
}
