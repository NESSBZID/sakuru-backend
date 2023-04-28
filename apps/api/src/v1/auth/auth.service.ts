import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from 'bcrypt';
import { UserEntity } from '@shared/entities';
import * as md5 from 'md5';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async validateUser(
    credential: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      where: [
        { safe_name: credential as string },
        { email: credential as string },
        { name: credential as string },
      ],
    });
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
