import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UsersServiceV1 } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.decorator';
import { UserEntity } from '@shared/entities';
import { UsersSearchDto } from '../dto/usersSearch.dto';
import UserCreateDto from '../dto/userCreate.dto';
import { RecaptchaGuard } from '@shared/guards/recaptcha.guard';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersControllerV1 {
  constructor(private usersService: UsersServiceV1) {}

  @Post()
  @UseGuards(RecaptchaGuard)
  async createUser(@Body() userCreateDto: UserCreateDto): Promise<UserEntity> {
    return await this.usersService.creteUser(userCreateDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@User() user: UserEntity) {
    return user;
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchUsers(@Query() usersSearchDto: UsersSearchDto) {
    return this.usersService.searchUsers(usersSearchDto);
  }
}
