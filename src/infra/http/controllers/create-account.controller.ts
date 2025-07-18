import {
  BadRequestException,
  ConflictException,
  UsePipes,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case StudentAlreadyExistsError:
            throw new ConflictException();
          default:
            throw new BadRequestException();
        }
      }
    }
  }
}
