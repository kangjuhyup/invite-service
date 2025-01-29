import { Test, TestingModule } from '@nestjs/testing';
import { TemplateFacade } from '../template.facade';
import { TemplateService } from '../service/template.service';
import { StorageService } from '@app/storage/storage.service';
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { CreateTemplateRequest } from '../dto/request/create.template';
import { User } from '@app/jwt/user';
import { InsertTemplateTransaction } from '../transaction/insert.transaction';
import { TemplateEntity } from '@app/database/entity/template/template';
import { LetterAttachmentCode } from '@app/util/attachment';
import { GetTemplatePageRequest } from '../dto/request/template.page';
import { TemplateDetailResponse } from '../dto/response/template.detail';
import { LetterEntity } from '@app/database/entity/letter/letter';
import { LetterService } from '@app/domain/letter/service/letter.service';

describe('TemplateFacade', () => {
  let facade: TemplateFacade;
  let mockTemplateService: TemplateService;
  let mockStorageService: StorageService;
  let mockInsertTemplateTransaction: InsertTemplateTransaction;
  let mockLetterService: LetterService;

  beforeEach(async () => {
    // Mock 객체 생성
    mockTemplateService = mock(TemplateService);
    mockStorageService = mock(StorageService);
    mockInsertTemplateTransaction = mock(InsertTemplateTransaction);
    mockLetterService = mock(LetterService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateFacade,
        {
          provide: TemplateService,
          useValue: instance(mockTemplateService),
        },
        {
          provide: StorageService,
          useValue: instance(mockStorageService),
        },
        {
          provide: InsertTemplateTransaction,
          useValue: instance(mockInsertTemplateTransaction),
        },
        {
          provide: LetterService,
          useValue: instance(mockLetterService),
        },
      ],
    }).compile();

    facade = module.get<TemplateFacade>(TemplateFacade);
  });

  describe('getTemplates', () => {
    it('템플릿 목록을 성공적으로 조회해야 합니다', async () => {
      // Given
      const mockTemplates = [
        {
          templateId: 1,
          userId: 'test-user',
          templateAttachment: [
            {
              attachmentCode: LetterAttachmentCode.THUMBNAIL,
              attachment: {
                attachmentPath: 'path/to/thumbnail',
                metadata: {
                  width: 100,
                  height: 100,
                },
              },
            },
          ],
        } as unknown as TemplateEntity,
      ] as unknown as TemplateEntity[];

      const request = new GetTemplatePageRequest();
      request.startAt = 1;
      request.limit = 10;

      when(mockTemplateService.getTemplates(deepEqual(request))).thenResolve({ totalCount : 1 ,entities : mockTemplates});

      // When
      const result = await facade.getTemplates(request);

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].templateId).toBe(1);
      expect(result[0].thumbnailPath).toBe('path/to/thumbnail');
      verify(mockTemplateService.getTemplates(deepEqual(request))).once();
    });
  });

  describe('getTemplateDetail', () => {
    it('템플릿 상세 정보를 성공적으로 조회해야 합니다', async () => {
      // Given
      const mockTemplate = {
        templateId: 1,
        userId: 'test-user',
        templateAttachment: [
          {
            attachmentCode: LetterAttachmentCode.BACKGROUND,
            attachment: {
              attachmentPath: 'path/to/background',
              metadata: {
                width: 800,
                height: 600,
                x: 0,
                y: 0,
                z: -1,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.COMPONENT,
            attachment: {
              attachmentPath: 'path/to/component',
              metadata: {
                width: 100,
                height: 100,
                x: 10,
                y: 10,
                z: 1,
                angle: 45,
              },
            },
          },
        ],
      } as unknown as TemplateEntity;

      when(mockTemplateService.getTemplate(1)).thenResolve(mockTemplate);

      // When
      const result = await facade.getTemplateDetail(1);

      // Then
      const expected = TemplateDetailResponse.of(mockTemplate);
      expect(result).toEqual(expected);
      verify(mockTemplateService.getTemplate(1)).once();
    });
  });

  describe('createTemplate', () => {
    it('템플릿을 성공적으로 생성해야 합니다', async () => {
      // Given
      const request = new CreateTemplateRequest();
      request.letterId = 1;

      const user: User = {
        id: 'test-user',
      };

      const mockLetter = {
        letterId: 1,
        userId: 'test-user',
        letterAttachment: [
          {
            attachmentCode: LetterAttachmentCode.THUMBNAIL,
            attachment: {
              attachmentPath: 'thumbnail.png',
              metadata: {
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.BACKGROUND,
            attachment: {
              attachmentPath: 'background.png',
              metadata: {
                width: 800,
                height: 600,
                x: 0,
                y: 0,
                z: -1,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.COMPONENT,
            attachment: {
              attachmentPath: 'component1.png',
              metadata: {
                width: 200,
                height: 200,
                x: 10,
                y: 10,
                z: 1,
                angle: 45,
              },
            },
          },
        ],
      } as unknown as LetterEntity;

      const expectedInput = {
        letterId: 1,
        userId: 'test-user',
        letterEntity: mockLetter,
        letterAttachment: mockLetter.letterAttachment
      };

      when(mockLetterService.getLetter(1)).thenResolve(mockLetter);
      when(mockInsertTemplateTransaction.run(deepEqual(expectedInput))).thenResolve(1);

      // When
      const result = await facade.createTemplate(request, user);

      // Then
      expect(result).toBe(1);
      verify(mockLetterService.getLetter(1)).once();
      verify(mockInsertTemplateTransaction.run(deepEqual(expectedInput))).once();
    });

    it('letterId가 없을 경우 에러를 던져야 합니다', async () => {
      // Given
      const request = new CreateTemplateRequest();
      const user: User = {
        id: 'test-user',
      };

      // When & Then
      await expect(facade.createTemplate(request, user)).rejects.toThrow();
    });

    it('letter가 존재하지 않을 경우 에러를 던져야 합니다', async () => {
      // Given
      const request = new CreateTemplateRequest();
      request.letterId = 999;
      const user: User = {
        id: 'test-user',
      };

      when(mockLetterService.getLetter(999)).thenResolve(null);

      // When & Then
      await expect(facade.createTemplate(request, user)).rejects.toThrow('Letter not found');
    });
  });
});
