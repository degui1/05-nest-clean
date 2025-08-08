import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';

@Controller('/questions/:slug')
@UseGuards(JwtAuthGuard)
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      question: QuestionDetailsPresenter.toHTTP(result.value.question),
    };
  }
}
