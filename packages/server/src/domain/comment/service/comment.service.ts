import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LetterCommentEntity } from "@app/database/entity/letter.comment";
import { LetterRepository } from "@app/database/repository/letter";

@Injectable()
export class CommentService {

    constructor(
        private readonly letterRepository: LetterRepository
    ) {}

    async addComment(param : {
        letterId : number,
        password : string,
        editor : string,
        content : string
    }) {
        const newComment = LetterCommentEntity.of(param.letterId, param.password, param.editor, param.content, 'addComment');
        return await this.letterRepository.insertComment({comment : newComment});
    }

    async selectComments(letterId: number) {
        return await this.letterRepository.selectComments({letterId});
    }

    async deleteComment(commentId: number) {
        await this.letterRepository.deleteComment({ letterCommentId: commentId });
    }

    async deleteCommentFromLetter(letterId: number) {
        await this.letterRepository.deleteCommentFromLetter({ letterId });
    }

    async checkCommentAuthor(commentId: number, password: string) {
        const comment = await this.letterRepository.selectComment({letterCommentId : commentId});
        if(!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
        if(!comment.verifyPassword(password)) throw new UnauthorizedException('잘못된 비밀번호 입니다.'); 
    }

}   