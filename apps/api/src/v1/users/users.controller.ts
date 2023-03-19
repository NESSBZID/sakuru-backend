import { Controller, Get } from '@nestjs/common';
import { UsersServiceV1 } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersControllerV1 {
  constructor(private usersService: UsersServiceV1) {}

  @Get('/me')
  async me() {
    return 'hello!';
  }
}
