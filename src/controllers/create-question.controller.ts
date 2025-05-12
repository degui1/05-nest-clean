import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string().email(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const { sub } = user;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: sub,
      },
    });
  }

  private convertToSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
