// src/letter/service/letter.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { LetterService } from '../service/letter.service';
import { LetterRepository } from '@app/database/repository/letter';
import { User } from '@app/jwt/user';
import { GetLetterResponse } from '../dto/response/get.letter';
import { GetLetterDetailResponse } from '../dto/response/get.detail';
import { LetterAttachmentCode } from '@app/util/attachment';

describe('LetterService', () => {
  let service: LetterService;
  let letterRepository: LetterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LetterService,
        {
          provide: LetterRepository,
          useValue: {
            selectLetterFromUser: jest.fn(),
            selectLetterFromId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LetterService>(LetterService);
    letterRepository = module.get<LetterRepository>(LetterRepository);
  });

  describe('getLetters', () => {
    it('should return paginated letters', async () => {
      const mockLetters = [
        {
          letterId: 1,
          title: 'Test Letter 1',
          letterCategoryCode: 'CATEGORY1',
          letterAttachment: [
            { 
              attachmentCode: LetterAttachmentCode.THUMBNAIL,
              attachment: { attachmentPath: 'path/to/thumbnail1' } 
            },
          ],
        },
        {
          letterId: 2,
          title: 'Test Letter 2',
          letterCategoryCode: 'CATEGORY2',
          letterAttachment: [
            { 
              attachmentCode: LetterAttachmentCode.THUMBNAIL,
              attachment: { attachmentPath: 'path/to/thumbnail2' } 
            },
          ],
        },
      ];

      (letterRepository.selectLetterFromUser as jest.Mock).mockResolvedValue([
        mockLetters,
        2,
      ]);

      const user: User = { id: 'mock' };
      const request: GetLetterPageRequest = { limit: 10, skip: 0 };

      const response: GetLetterPageResponse = await service.getLetters(
        request,
        user,
      );

      expect(letterRepository.selectLetterFromUser).toHaveBeenCalledWith({
        userId: user.id,
        limit: request.limit,
        skip: request.skip,
      });

      expect(response).toEqual({
        totalCount: 2,
        items: [
          {
            id: 1,
            title: 'Test Letter 1',
            category: 'CATEGORY1',
            thumbnail: 'path/to/thumbnail1',
          },
          {
            id: 2,
            title: 'Test Letter 2',
            category: 'CATEGORY2',
            thumbnail: 'path/to/thumbnail2',
          },
        ],
      });
    });
  });

  describe('getLetter', () => {
    it('should return letter details', async () => {
      const mockLetter = {
        letterId: 1,
        letterAttachment: [
          {
            attachmentCode: LetterAttachmentCode.LETTER,
            attachment: { attachmentPath: 'path/to/letter' },
            width: 100,
            height: 200,
          },
        ],
        letterComment: [
          {
            editor: 'John',
            body: 'Great letter!',
          },
        ],
      };

      (letterRepository.selectLetterFromId as jest.Mock).mockResolvedValue(mockLetter);

      const response: GetLetterResponse = await service.getLetter(1);

      expect(letterRepository.selectLetterFromId).toHaveBeenCalledWith({
        letterId: 1,
      });

      expect(response).toEqual({
        letterId: 1,
        letter: {
          path: 'path/to/letter',
          width: 100,
          height: 200,
        },
        comments: [
          {
            name: 'John',
            body: 'Great letter!',
          },
        ],
      });
    });
  });

  describe('getLetterDetail', () => {
    it('should return letter detail information', async () => {
      const mockLetter = {
        letterId: 1,
        title: 'Test Letter',
        body: 'Letter content',
        letterAttachment: [
          {
            attachmentCode: LetterAttachmentCode.BACKGROUND,
            attachment: { attachmentPath: 'path/to/background' },
            width: 800,
            height: 600,
          },
          {
            attachmentCode: LetterAttachmentCode.COMPONENT,
            attachment: { attachmentPath: 'path/to/component1' },
            width: 100,
            height: 100,
            x: 10,
            y: 20,
            z: 1,
            angle: 45,
          },
        ],
      };

      (letterRepository.selectLetterFromId as jest.Mock).mockResolvedValue(mockLetter);

      const response: GetLetterDetailResponse = await service.getLetterDetail(1);

      expect(letterRepository.selectLetterFromId).toHaveBeenCalledWith({
        letterId: 1,
      });

      expect(response).toEqual({
        title: 'Test Letter',
        body: 'Letter content',
        background: {
          path: 'path/to/background',
          width: 800,
          height: 600,
        },
        components: [
          {
            path: 'path/to/component1',
            width: 100,
            height: 100,
            x: 10,
            y: 20,
            z: 1,
            ang: 45,
          },
        ],
      });
    });
  });
});
