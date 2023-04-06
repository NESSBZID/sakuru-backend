import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersServiceV1 } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.decorator';
import { UserEntity } from '@shared/entities';
import { UserSearchDto } from '../dto/userSearch.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersControllerV1 {
  constructor(private usersService: UsersServiceV1) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@User() user: UserEntity) {
    return user;
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async search(@Query() userSearchDto: UserSearchDto) {
    return this.usersService.searchUser(userSearchDto);
  }
}
