import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  async findById(id: string) {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return Promise.resolve(questionComment);
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(questionComments);
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    return Promise.resolve();
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);

    return Promise.resolve();
  }
}
