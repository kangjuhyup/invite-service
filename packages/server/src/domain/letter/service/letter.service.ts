import { Injectable, Logger } from '@nestjs/common';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { GetLetterDetailResponse } from '../dto/response/get.detail';
import { LetterRepository } from '@app/database/repository/letter';
import { User } from '@app/jwt/user';
import { GetLetterResponse } from '../dto/response/get.letter';
import { LetterAttachmentCode } from '@app/util/attachment';
import { randomString } from '@app/util/random';
import { LetterEntity } from '@app/database/entity/letter';

@Injectable()
export class LetterService {
  private logger = new Logger(LetterService.name);

  constructor(private readonly letterRepository: LetterRepository) {}

  async getLetters(
    { limit, skip }: GetLetterPageRequest,
    user: User,
  ): Promise<[LetterEntity[], number]> {
    return await this.letterRepository.selectLetterFromUser({
      userId: user.id,
      limit,
      skip,
    });
  }

  async getLetter(id: number): Promise<LetterEntity> {
    return await this.letterRepository.selectLetterFromId({
      letterId: id,
    });
  }

  async generateLetterPassword(letterId: number) {
    const password = randomString(10);
    await this.letterRepository.updateLetterPassword({
      letterId,
      password,
      updator: 'generateLetterPassword',
    });
    return password;
  }

  async deleteLetter(id: number) {
    await this.letterRepository.deleteLetter({ letterId: id });
  }

  async checkLetterAuthor(letterId: number, user: User) {
    const letter = await this.letterRepository.selectLetterFromId({
      letterId,
    });
    if (letter.userId !== user.id)
      throw new Error('작성자가 아닙니다.');
  }

  async updateLetter(param : {
    letterId: number;
    title?: string;
    body?: string;
    commentYn?: boolean;
    attendYn?: boolean;
    updator: string;
  }) {
    await this.letterRepository.updateLetter(param);
  }
}
