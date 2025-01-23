import { LetterCommentEntity } from '@app/database/entity/letter.comment';

class Comment {
  id: number;
  editor: string;
  body: string;

  static of(entity: LetterCommentEntity) {
    const comment = new Comment();
    comment.id = entity.letterCommentId;
    comment.editor = entity.editor;
    comment.body = entity.body;
    return comment;
  }
}

export class GetLetterCommentResponse {
  letterId: number;
  comments: Comment[];

  static of(letterId: number, comments: LetterCommentEntity[]) {
    const response = new GetLetterCommentResponse();
    response.letterId = letterId;
    response.comments = comments.map((comment) => Comment.of(comment));
    return response;
  }
}
