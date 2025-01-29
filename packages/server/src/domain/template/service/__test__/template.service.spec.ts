import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from '../template.service';
import { TemplateRepository } from '@app/database/repository/template';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { YN } from '@app/util/yn';
import { TemplateEntity } from '@app/database/entity/template/template';

describe('TemplateService', () => {
  let service: TemplateService;
  let mockTemplateRepository: TemplateRepository;

  beforeEach(async () => {
    // Mock 객체 생성
    mockTemplateRepository = mock(TemplateRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: TemplateRepository,
          useValue: instance(mockTemplateRepository),
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  describe('getTemplatePage', () => {
    it('템플릿 페이지를 성공적으로 조회해야 합니다', async () => {
      // Given
      const mockTemplates = [
        {
          templateId: 1,
          userId : 'user1',
          useYn: YN.Y,
          templateAttachment: [
            {
              templateId : 1,
              attachmentCode : 'THUMBNAIL',
              attachmentId : 1,
              attachment: {
                attachmentId : 1,
                attachmentPath: 'path/to/thumbnail',
                metadata: {
                  width: 100,
                  height: 100,
                },
              },
            },
          ],
        }
      ] as unknown as TemplateEntity[];

      when(mockTemplateRepository.selectTemplates(anything())).thenResolve(mockTemplates);
      when(mockTemplateRepository.selectTemplateTotalCount()).thenResolve(1);
      // When
      const result = await service.getTemplates({ startAt: 1, limit: 10 });

      // Then
      expect(result.entities).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });
  });

  describe('getTemplateDetail', () => {
    it('템플릿 상세 정보를 성공적으로 조회해야 합니다', async () => {
      // Given
      const mockTemplate = {
        templateId: 1,
        title: '템플릿 1',
        useYn: YN.Y,
        templateAttachment: [
          {
            attachment: {
              attachmentPath: 'path/to/background',
              metadata: {
                width: 800,
                height: 600,
              },
            },
          },
        ],
      } as unknown as TemplateEntity;

      when(mockTemplateRepository.selectTemplateFromId(anything())).thenResolve(mockTemplate);

      // When
      const result = await service.getTemplate(1);

      // Then
      expect(result.templateId).toBe(1);
    });

    it('존재하지 않는 템플릿을 조회할 경우 에러를 던져야 합니다', async () => {
      // Given
      when(mockTemplateRepository.selectTemplateFromId(anything())).thenResolve(undefined);

      // When & Then
      await expect(service.getTemplate(999)).rejects.toThrow('템플릿을 찾을 수 없습니다.');
    });
  });
});
