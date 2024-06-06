import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET balance`, async () => {
    return request(app.getHttpServer())
      .get('/balance?account_id=1')
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(20);
      });
  });

  it(`/GET balance with exception`, async () => {
    return request(app.getHttpServer())
      .get('/balance?account_id=1123')
      .then(({ body, statusCode }) => {
        expect(statusCode).toEqual(404);
        expect(body).toEqual(0);
      });
  });

  it(`/POST reset`, async () => {
    return request(app.getHttpServer())
      .post('/reset')
      .then(({ statusCode, text }) => {
        expect(statusCode).toEqual(200);
        expect(text).toEqual('OK');
      });
  });

  it(`/POST event`, async () => {
    return request(app.getHttpServer())
      .post('/event')
      .send({ type: 'deposit', origin: '', destination: '1', amount: 1 })
      .then(({ statusCode, body }) => {
        expect(statusCode).toEqual(201);
        expect(body).toEqual({ destination: { balance: 21, id: '1' } });
      });
  });

  it(`/POST event with exception`, async () => {
    return request(app.getHttpServer())
      .post('/event')
      .send({ type: 'depasdosit', origin: '', destination: '', amount: 1 })
      .then(({ statusCode, body }) => {
        expect(statusCode).toEqual(400);
        expect(body).toEqual(0);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
