import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  handle() {
    const token = this.jwt.sign({ sub: 'user_id' });

    return token;
  }
}
