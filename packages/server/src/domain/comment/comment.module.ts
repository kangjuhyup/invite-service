import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./service/comment.service";
import { CommentFacade } from "./comment.facade";

const services = [
    CommentService,
]

@Module({
    controllers: [CommentController],
    providers: [...services, CommentFacade],
    exports: [...services]
})
export class CommentModule {}