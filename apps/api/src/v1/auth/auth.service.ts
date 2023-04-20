import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersServiceV1 } from '../users/users.service';
import { compare as bcryptCompare } from 'bcrypt';
import { UserEntity } from '@shared/entities';
import * as md5 from 'md5';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private readonly usersService: UsersServiceV1,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    credential: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findUser(credential);
    if (!user) throw new NotFoundException('Could not find the user.');

    const passwordValid = await bcryptCompare(md5(password), user.pw_bcrypt);
    if (user && passwordValid) return user;

    return null;
  }

  async login(user: UserEntity) {
    const payload = { username: user.safe_name, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
