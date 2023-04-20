import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@shared/http/http.servce';
import { RecaptchaResponse } from '@shared/interfaces/responses/recaptcha.interface';
import UserCreateDto from 'apps/api/src/v1/dto/userCreate.dto';
import { Request } from 'express';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userCreateDto = context.switchToHttp().getRequest<Request>()
      .body as UserCreateDto;

    const { data } = await this.httpService.post<RecaptchaResponse>(
      `https://www.google.com/recaptcha/api/siteverify?response=${
        userCreateDto.captcha_token
      }&secret=${this.configService.get('RECAPTCHA_SECRET')}`,
    );

    if (!data.success) {
      throw new ForbiddenException('register.validation.recaptcha.invalid');
    }

    return true;
  }
}
