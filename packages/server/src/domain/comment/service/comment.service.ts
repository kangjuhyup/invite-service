import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LetterCommentEntity } from '@app/database/entity/letter/letter.comment';
import { LetterRepository } from '@app/database/repository/letter';

@Injectable()
export class CommentService {
  constructor(private readonly letterRepository: LetterRepository) {}

  async addComment(param: {
    letterId: number;
    password: string;
    editor: string;
    content: string;
  }) {
    const newComment = LetterCommentEntity.of(
      param.letterId,
      param.password,
      param.editor,
      param.content,
      'addComment',
    );
    const comment =  await this.letterRepository.insertComment({ comment: newComment });
    await this.letterRepository.increaseLetterCommentCount({letterId: param.letterId})
    return comment;
  }

  async selectComments(letterId: number) {
    return await this.letterRepository.selectComments({ letterId });
  }

  async deleteComment(commentId: number) {
    const comment = await this.letterRepository.selectComment({
      letterCommentId: commentId,
    });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    await this.letterRepository.deleteComment({ letterCommentId: commentId });
    await this.letterRepository.decreaseLetterCommentCount({letterId: comment.letterId})
  }

  async deleteCommentFromLetter(letterId: number) {
    await this.letterRepository.deleteCommentFromLetter({ letterId });
  }

  async checkCommentAuthor(commentId: number, password: string) {
    const comment = await this.letterRepository.selectComment({
      letterCommentId: commentId,
    });
    if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (!comment.verifyPassword(password))
      throw new UnauthorizedException('잘못된 비밀번호 입니다.');
  }
}
