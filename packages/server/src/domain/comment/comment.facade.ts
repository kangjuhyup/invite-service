import { Injectable } from "@nestjs/common";
import { CommentService } from "./service/comment.service";
import { AddCommentRequest } from "./dto/add.comment";
import { User } from "@app/jwt/user";

@Injectable()
export class CommentFacade {
    constructor(
        private readonly commentService: CommentService,
    ) {}

    async selectComments(letterId: number) {
        return await this.commentService.selectComments(letterId);
    }

    async addComment(letterId: number, dto: AddCommentRequest) {
        return await this.commentService.addComment({
            letterId: letterId,
            password: dto.password,
            editor: dto.editor,
            content: dto.content
        });
    }

    async deleteComment(commentId: number, password: string) {
        await this.commentService.checkCommentAuthor(commentId, password);
        return await this.commentService.deleteComment(commentId);
    }
}