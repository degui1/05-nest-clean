import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return Promise.resolve(answerAttachments);
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    this.items = answerAttachments;

    return Promise.resolve();
  }
}
