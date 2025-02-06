import { Injectable } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { AddCommentRequest } from './dto/request/add.comment';
import { GetLetterCommentResponse } from './dto/response/get.comment.response';

@Injectable()
export class CommentFacade {
  constructor(private readonly comment: CommentService) {}

  async selectComments(letterId: number) : Promise<GetLetterCommentResponse> {
    const comments = await this.comment.selectComments(letterId);
    return GetLetterCommentResponse.of(letterId, comments);
  }

  async addComment(letterId: number, dto: AddCommentRequest) {
    return await this.comment.addComment({
      letterId: letterId,
      password: dto.password,
      editor: dto.editor,
      content: dto.content,
    });
  }

  async deleteComment(commentId: number, password: string) {
    await this.comment.checkCommentAuthor(commentId, password);
    return await this.comment.deleteComment(commentId);
  }
}
