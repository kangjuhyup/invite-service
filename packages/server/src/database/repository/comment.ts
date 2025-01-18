import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LetterCommentEntity } from "../entity/letter.comment";
import { Repository } from "typeorm";
import { YN } from "@app/util/yn";

@Injectable()
export class CommentRepository {
    
    constructor(
        @InjectRepository(LetterCommentEntity) 
        private readonly comment: Repository<LetterCommentEntity>,
    ) {}

    
}