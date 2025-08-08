import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { StudentFactory } from 'test/factories/make-student';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AttachmentFactory } from 'test/factories/make-attachment';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    expect(response.statusCode).toEqual(201);

    const questionDatabase = await prisma.question.findFirst({
      where: { title: 'New question' },
    });

    expect(questionDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
