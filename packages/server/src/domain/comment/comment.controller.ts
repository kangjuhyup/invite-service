import { Body, Controller, Delete, Get, Headers, Param, Post, UseGuards } from "@nestjs/common";
import { AddCommentRequest } from "./dto/add.comment";
import { UserAccessGuard } from "@app/jwt/guard/user.access.guard";
import { CommentFacade } from "./comment.facade";
import { ApiOperation, ApiParam, ApiHeader, ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags('Comment')
@Controller('comment')
export class CommentController {

    constructor(
        private readonly commentFacade: CommentFacade
    ) {}

    @ApiOperation({ summary: '초대장의 댓글 목록 조회' })
    @ApiParam({ name: 'letterId', description: '초대장 ID' })
    @Get('/letter/:letterId')
    async getComments(@Param('letterId') letterId: number) {
        return this.commentFacade.selectComments(letterId);
    }

    @ApiOperation({ summary: '초대장에 댓글 작성' })
    @ApiParam({ name: 'letterId', description: '초대장 ID' })
    @ApiBody({ type: AddCommentRequest })
    @Post('/letter/:letterId')
    async addComment(@Param('letterId') letterId: number, @Body() dto: AddCommentRequest) {
        return this.commentFacade.addComment(letterId, dto);
    }

    @ApiOperation({ summary: '댓글 삭제' })
    @ApiParam({ name: 'commentId', description: '댓글 ID' })
    @ApiHeader({ 
        name: 'x-comment-password',
        description: '댓글 작성 시 입력한 비밀번호',
        required: true
    })
    @Delete('/:commentId')
    async deleteComment(
        @Param('commentId') commentId: number, 
        @Headers('x-comment-password') password: string
    ) {
        return this.commentFacade.deleteComment(commentId, password);
    }
}