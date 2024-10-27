import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { SignRequest } from '@app/domain/auth/dto/sign';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('회원', () => {
    it('[POST] /auth/signup', () => {
      const body: SignRequest = {
        phone: '01012341234',
        password: 'test',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(201)
        .expect((response) => {
          expect(response.headers['authorization']).toBeDefined();
        });
    });

    it('[POST] /auth/signin (성공)', () => {
      const body: SignRequest = {
        phone: '01012341234',
        password: 'test',
      };
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(body)
        .expect(201)
        .expect((response) => {
          expect(response.headers['authorization']).toBeDefined();
        });
    });

    it('[POST] /auth/signin (잘못된 비밀번호)', () => {
      const body: SignRequest = {
        phone: '01012341234',
        password: 'test1111',
      };
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(body)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('잘못된 비밀번호입니다.');
        });
    });

    it('[POST] /auth/signin (없는 유저)', () => {
      const body: SignRequest = {
        phone: '01043214321',
        password: 'test1111',
      };
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(body)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('존재하지 않는 회원입니다.');
        });
    });
  });

  describe('초대장', () => {
    it('[GET] /letter', () => {
      return request(app.getHttpServer()).get('/letter').expect(200);
    });
  });
});
