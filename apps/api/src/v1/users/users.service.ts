import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Repository } from 'typeorm';
import { UsersSearchDto } from '../dto/usersSearch.dto';
import { hash as bcryptHash } from 'bcrypt';
import UserCreateDto from '../dto/userCreate.dto';
import * as md5 from 'md5';
import { makeSafeName } from '@shared/shared.utils';

@Injectable()
export class UsersServiceV1 {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUser(clause: string): Promise<UserEntity> | null {
    return await this.userRepository.findOne({
      where: [{ safe_name: clause }, { email: clause }, { name: clause }],
    });
  }

  async findById(user_id: number): Promise<UserEntity> | null {
    return await this.userRepository.findOne({
      where: { id: user_id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> | null {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  async findBySafeName(safe_name: string): Promise<UserEntity> | null {
    return await this.userRepository.findOne({
      where: { safe_name: safe_name },
    });
  }

  async creteUser(userCreateDto: UserCreateDto): Promise<UserEntity> {
    if (await this.findUser(userCreateDto.username)) {
      throw new ConflictException('register.validation.username.exists');
    } else if (await this.findUser(userCreateDto.email)) {
      throw new ConflictException('register.validation.email.exists');
    }

    const password_md5 = md5(userCreateDto.password);
    const password_hash = await bcryptHash(password_md5, 12);

    const user = this.userRepository.create({
      name: userCreateDto.username,
      safe_name: makeSafeName(userCreateDto.username),
      email: userCreateDto.email,
      pw_bcrypt: password_hash,
    });

    return await this.userRepository.save(user);
  }

  async searchUsers(usersSearchDto: UsersSearchDto): Promise<UserEntity[]> {
    const searchResult = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :name', {
        name: `%${usersSearchDto.query}%`,
      })
      .orWhere('user.safe_name LIKE :safe_name', {
        safe_name: `%${usersSearchDto.query}%`,
      })
      .limit(usersSearchDto.limit)
      .offset(usersSearchDto.offset)
      .getMany();

    return searchResult;
  }
}
