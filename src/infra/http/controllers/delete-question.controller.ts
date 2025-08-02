import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { sub } = user;

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
