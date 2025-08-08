import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body;
    const { sub } = user;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: sub,
      attachmentIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
