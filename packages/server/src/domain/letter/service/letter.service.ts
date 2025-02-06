import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { LetterRepository } from '@app/database/repository/letter';
import { User } from '@app/jwt/user';
import { randomString } from '@app/util/random';
import { LetterEntity } from '@app/database/entity/letter/letter';

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
    await this.letterRepository.increaseLetterViewCount({ letterId: id });
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
    const letter =
      await this.letterRepository.selectLetterFromIdWithoutRelations({
        letterId,
      });
    this.logger.debug(`letter : ${JSON.stringify(letter)}`);
    if (letter.userId !== user.id)
      throw new ForbiddenException('작성자가 아닙니다.');
  }

  async checkLetterCount(user: User) {
    const count = await this.letterRepository.selectLetterCountFromUser({
      userId: user.id,
    });
    if (count >= 5) throw new BadRequestException('5개 이하의 글자만 작성 가능');
  }

  async updateLetter(param: {
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
