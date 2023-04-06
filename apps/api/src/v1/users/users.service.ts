import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Repository } from 'typeorm';
import { UsersSearchDto } from '../dto/usersSearch.dto';

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
