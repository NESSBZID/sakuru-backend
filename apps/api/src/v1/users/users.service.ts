import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';
import { Repository } from 'typeorm';
import { UsersSearchDto } from '../dto/usersSearch.dto';
import { hash as bcryptHash } from 'bcrypt';
import UserCreateDto from '../dto/userCreate.dto';
import * as md5 from 'md5';
import { makeSafeName } from '@shared/shared.utils';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { GameModes } from '@shared/enums/GameModes.enum';
import { CustomClientTCP } from '@shared/tcp-client/customClient';
import { catchError, firstValueFrom, take } from 'rxjs';
import { IUsersGraphsMessage } from '@shared/interfaces/messages/statistics.interface';
import IUserGraphsResponse from '@shared/interfaces/responses/userGraphs.interface';

@Injectable()
export class UsersServiceV1 {
  public readonly logger = new Logger(UsersServiceV1.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRedis()
    private readonly redisClient: Redis,
    @Inject('GRAPHS_SERVICE') private graphsService: CustomClientTCP,
  ) {}

  async onModuleInit() {
    await this.graphsService.connect();
  }

  async userExists(clause: string | number): Promise<boolean> {
    const isExists = await this.userRepository.exist({
      where: [
        { id: clause as number },
        { safe_name: clause as string },
        { email: clause as string },
        { name: clause as string },
      ],
    });

    return isExists;
  }

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
    if (await this.userExists(userCreateDto.username)) {
      throw new ConflictException('register.validation.username.exists');
    } else if (await this.userExists(userCreateDto.email)) {
      throw new ConflictException('register.validation.email.exists');
    }

    const password_md5 = md5(userCreateDto.password);
    const password_hash = await bcryptHash(password_md5, 12);

    const user = await this.userRepository.save({
      name: userCreateDto.username,
      safe_name: makeSafeName(userCreateDto.username),
      email: userCreateDto.email,
      pw_bcrypt: password_hash,
    });

    for (const mode in GameModes) {
      if (!isNaN(Number(mode))) continue;

      // Add user to global leaderboard
      this.redisClient.zadd(`sakuru:leaderboard:${mode}`, 0, user.id);

      // Add user to country leaderboard
      this.redisClient.zadd(
        `sakuru:leaderboard:${mode}:${user.country}`,
        0,
        user.id,
      );
    }

    return user;
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

  async getUsersGraphs(
    userId: number,
    mode: GameModes,
  ): Promise<IUserGraphsResponse> {
    if (!(await this.userExists(userId)))
      throw new NotFoundException('User not found.');

    const observable = this.graphsService
      .send<IUserGraphsResponse, IUsersGraphsMessage>(
        'statistics.users_graphs.get',
        {
          user_id: userId,
          mode: mode,
        },
      )
      .pipe(
        take(1),
        catchError((err: string, _) => {
          throw new NotFoundException(err);
        }),
      );

    const data = await firstValueFrom(observable).catch((_) => {
      return;
    });

    if (!data) throw new NotFoundException("User's graphs not found.");

    return data;
  }
}
