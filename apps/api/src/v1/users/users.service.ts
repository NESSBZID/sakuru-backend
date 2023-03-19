import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Repository } from 'typeorm';

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
}
