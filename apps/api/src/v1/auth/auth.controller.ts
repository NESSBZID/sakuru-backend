import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserEntity } from '@shared/entities';
import { AuthServiceV1 } from './auth.service';
import { RecaptchaGuard } from '@shared/guards/recaptcha.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthControllerV1 {
  constructor(private authService: AuthServiceV1) {}

  @Post('login')
  @UseGuards(RecaptchaGuard)
  @UseGuards(AuthGuard('local'))
  async login(
    @Req() reqest: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserEntity> {
    if (
      reqest.cookies &&
      'token' in reqest.cookies &&
      reqest.cookies.token.length > 0
    )
      throw new BadRequestException({
        info: 'Already Authorized!',
      });

    const { access_token } = await this.authService.login(
      <UserEntity>reqest.user,
    );

    response.cookie('token', access_token, {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
    });

    return <UserEntity>reqest.user;
  }
}
