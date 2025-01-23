import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { LetterService } from '../service/letter.service';
import { LetterRepository } from '@app/database/repository/letter';
import { User } from '@app/jwt/user';
import { LetterAttachmentCode } from '@app/util/attachment';
import { YN } from '@app/util/yn';

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
            updateLetterPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LetterService>(LetterService);
    letterRepository = module.get<LetterRepository>(LetterRepository);
  });

  describe('getLetters', () => {
    it('should return letters array and count', async () => {
      const mockLetters = [
        {
          letterId: 1,
          title: 'Test Letter 1',
          letterCategoryCode: 'CATEGORY1',
          letterAttachment: [
            {
              attachmentCode: LetterAttachmentCode.THUMBNAIL,
              attachment: { attachmentPath: 'path/to/thumbnail1' },
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
              attachment: { attachmentPath: 'path/to/thumbnail2' },
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

      const [letters, count] = await service.getLetters(request, user);

      expect(letterRepository.selectLetterFromUser).toHaveBeenCalledWith({
        userId: user.id,
        limit: request.limit,
        skip: request.skip,
      });

      expect(letters).toEqual(mockLetters);
      expect(count).toBe(2);
    });
  });

  describe('getLetter', () => {
    it('should return letter entity', async () => {
      const mockLetter = {
        letterId: 1,
        publicYn: YN.Y,
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

      (letterRepository.selectLetterFromId as jest.Mock).mockResolvedValue(
        mockLetter,
      );

      const letter = await service.getLetter(1);

      expect(letterRepository.selectLetterFromId).toHaveBeenCalledWith({
        letterId: 1,
      });

      expect(letter).toEqual(mockLetter);
    });
  });

  describe('generateLetterPassword', () => {
    it('should generate and update letter password', async () => {
      const letterId = 1;
      const mockPassword = 'generatedPassword';

      jest.spyOn(global.Math, 'random').mockReturnValue(0.5);

      await service.generateLetterPassword(letterId);

      expect(letterRepository.updateLetterPassword).toHaveBeenCalledWith({
        letterId,
        password: expect.any(String),
        updator: 'generateLetterPassword',
      });
    });
  });
});
