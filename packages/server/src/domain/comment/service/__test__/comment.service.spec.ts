import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comment.service';
import { LetterRepository } from '@app/database/repository/letter';
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { LetterCommentEntity } from '@app/database/entity/letter/letter.comment';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InsertResult } from 'typeorm';

describe('CommentService', () => {
  let service: CommentService;
  let mockLetterRepository: LetterRepository;

  const testCommentData = {
    letterId: 1,
    password: 'testPassword',
    editor: '테스트작성자',
    content: '테스트 댓글입니다.',
  };

  beforeEach(async () => {
    mockLetterRepository = mock(LetterRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: LetterRepository,
          useValue: instance(mockLetterRepository),
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  describe('addComment', () => {
    it('새로운 댓글을 추가해야 함', async () => {
      // given
      const newComment = LetterCommentEntity.of(
        testCommentData.letterId,
        testCommentData.password,
        testCommentData.editor,
        testCommentData.content,
        'addComment',
      );
      const insertResult: InsertResult = {
        identifiers: [{ id: 1 }],
        generatedMaps: [{ id: 1 }],
        raw: { id: 1 },
      };
      when(mockLetterRepository.insertComment(anything())).thenResolve(
        insertResult,
      );

      // when
      await service.addComment(testCommentData);

      // then
      verify(mockLetterRepository.insertComment(anything())).once();
    });
  });

  describe('selectComments', () => {
    it('특정 초대장의 댓글 목록을 조회해야 함', async () => {
      // given
      const comments = [
        LetterCommentEntity.of(
          1,
          'password1',
          'editor1',
          'content1',
          'selectComments',
        ),
        LetterCommentEntity.of(
          1,
          'password2',
          'editor2',
          'content2',
          'selectComments',
        ),
      ];
      when(
        mockLetterRepository.selectComments(deepEqual({ letterId: 1 })),
      ).thenResolve(comments);

      // when
      const result = await service.selectComments(1);

      // then
      expect(result).toEqual(comments);
      verify(
        mockLetterRepository.selectComments(deepEqual({ letterId: 1 })),
      ).once();
    });
  });

  describe('deleteComment', () => {
    it('특정 댓글을 삭제해야 함', async () => {
      // given
      const commentId = 1;
      when(
        mockLetterRepository.deleteComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).thenResolve();

      // when
      await service.deleteComment(commentId);

      // then
      verify(
        mockLetterRepository.deleteComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).once();
    });
  });

  describe('deleteCommentFromLetter', () => {
    it('초대장의 모든 댓글을 삭제해야 함', async () => {
      // given
      const letterId = 1;
      when(
        mockLetterRepository.deleteCommentFromLetter(deepEqual({ letterId })),
      ).thenResolve();

      // when
      await service.deleteCommentFromLetter(letterId);

      // then
      verify(
        mockLetterRepository.deleteCommentFromLetter(deepEqual({ letterId })),
      ).once();
    });
  });

  describe('checkCommentAuthor', () => {
    it('올바른 비밀번호로 인증 성공해야 함', async () => {
      // given
      const commentId = 1;
      const password = 'correctPassword';
      const comment = LetterCommentEntity.of(
        1,
        password,
        '작성자',
        '내용',
        'checkCommentAuthor',
      );
      comment.letterCommentId = commentId;

      when(
        mockLetterRepository.selectComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).thenResolve(comment);

      // when & then
      await expect(
        service.checkCommentAuthor(commentId, password),
      ).resolves.not.toThrow();
      verify(
        mockLetterRepository.selectComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).once();
    });

    it('댓글이 존재하지 않으면 NotFoundException을 던져야 함', async () => {
      // given
      const commentId = 1;
      when(
        mockLetterRepository.selectComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).thenResolve(null);

      // when & then
      await expect(
        service.checkCommentAuthor(commentId, 'anyPassword'),
      ).rejects.toThrow(new NotFoundException('댓글을 찾을 수 없습니다.'));
    });

    it('잘못된 비밀번호로 UnauthorizedException을 던져야 함', async () => {
      // given
      const commentId = 1;
      const correctPassword = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const comment = LetterCommentEntity.of(
        1,
        correctPassword,
        '작성자',
        '내용',
        'checkCommentAuthor',
      );
      comment.letterCommentId = commentId;

      when(
        mockLetterRepository.selectComment(
          deepEqual({ letterCommentId: commentId }),
        ),
      ).thenResolve(comment);

      // when & then
      await expect(
        service.checkCommentAuthor(commentId, wrongPassword),
      ).rejects.toThrow(new UnauthorizedException('잘못된 비밀번호 입니다.'));
    });
  });
});
