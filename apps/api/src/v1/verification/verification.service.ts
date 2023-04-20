import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { globalState } from '../../global.state';

@Injectable()
export class VerificationServiceV1 {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async subscribe(user: number, socket: Socket): Promise<boolean> {
    const isExistingUser = await this.userRepository.exist({
      where: { id: user, priv: 1 },
    });

    if (
      !isExistingUser ||
      globalState.verificationQueue.includes({
        user: user,
        socket: socket,
      })
    )
      return false;

    globalState.verificationQueue.push({
      user: user,
      socket: socket,
    });

    return true;
  }
}
