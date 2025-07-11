import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { envSchema } from './env';
import { CreateAccountController } from './http/controllers/create-account.controller';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { CreateQuestionController } from './http/controllers/create-question.controller';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
})
export class AppModule {}
