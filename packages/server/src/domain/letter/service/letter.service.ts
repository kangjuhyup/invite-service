import { Injectable, Logger } from '@nestjs/common';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { GetLetterDetailResponse } from '../dto/response/get.detail';
import { LetterRepository } from '@app/database/repository/letter';
import { User } from '@app/jwt/user';
import { GetLetterResponse } from '../dto/response/get.letter';
import { LetterAttachmentCode } from '@app/util/attachment';

@Injectable()
export class LetterService {
  private logger = new Logger(LetterService.name);

  constructor(private readonly letterRepository: LetterRepository) {}

  async getLetters(
    { limit, skip }: GetLetterPageRequest,
    user: User,
  ): Promise<GetLetterPageResponse> {
    const letters = await this.letterRepository.selectLetterFromUser({
      userId: user.id,
      limit,
      skip,
    });
    return GetLetterPageResponse.of(letters[1], letters[0]);
  }

  async getLetter(id: number): Promise<GetLetterResponse> {
    const letter = await this.letterRepository.selectLetterFromId({
      letterId: id,
    });
    const lt = letter.letterAttachment.find(
      (la) => la.attachmentCode === LetterAttachmentCode.LETTER,
    );

    return GetLetterResponse.of(letter);
  }

  async getLetterDetail(id: number): Promise<GetLetterDetailResponse> {
    const letter = await this.letterRepository.selectLetterFromId({
      letterId: id,
    });
    return GetLetterDetailResponse.of(letter);
  }
}
