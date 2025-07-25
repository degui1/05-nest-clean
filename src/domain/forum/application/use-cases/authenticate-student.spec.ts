import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

import { AuthenticateStudentUseCase } from './authenticate-student';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase; // system under test - sut

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    await inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      accessToken: expect.any(String),
    });
  });
});
