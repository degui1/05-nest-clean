import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-question-comment';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase; // system under test - sut

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    await Promise.all(
      Array.from({ length: 3 }, () =>
        inMemoryQuestionCommentsRepository.create(
          makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
        ),
      ),
    );
    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question comments', async () => {
    await Promise.all(
      Array.from({ length: 22 }, () =>
        inMemoryQuestionCommentsRepository.create(
          makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
        ),
      ),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
