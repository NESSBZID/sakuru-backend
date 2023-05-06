import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatEntity, UserEntity } from '@shared/entities';
import { Repository } from 'typeorm';
import UsersSearch from '../dto/usersSearch.dto';
import { hash as bcryptHash } from 'bcrypt';
import UserCreate from '../dto/userCreate.dto';
import * as md5 from 'md5';
import {
  getLevelPrecise,
  makeSafeName,
  toFixedNoRound,
} from '@shared/shared.utils';
import { GameModes } from '@shared/enums/GameModes.enum';
import { CustomClientTCP } from '@shared/tcp-client/customClient';
import { catchError, firstValueFrom, take } from 'rxjs';
import { IUsersGraphsMessage } from '@shared/interfaces/messages/statistics.interface';
import IUserGraphsResponse from '@shared/interfaces/responses/userGraphs.interface';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { IUserStatsResponse } from '../dto/userStats.dto';

@Injectable()
export class UsersServiceV1 {
  public readonly logger = new Logger(UsersServiceV1.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StatEntity)
    private readonly statRepository: Repository<StatEntity>,
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

  async findUser(clause: string | number): Promise<UserEntity> | null {
    return await this.userRepository.findOne({
      where: [
        { id: clause as number },
        { safe_name: clause as string },
        { email: clause as string },
        { name: clause as string },
      ],
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

  async creteUser(userCreateDto: UserCreate): Promise<UserEntity> {
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

    return user;
  }

  async searchUsers(usersSearchDto: UsersSearch): Promise<UserEntity[]> {
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
      return {
        mode: mode,
        data: [],
      };
    });

    return data;
  }

  async getUserStats(
    userId: number,
    mode: GameModes,
  ): Promise<IUserStatsResponse> {
    const { user_country: userCountry } = await this.userRepository
      .createQueryBuilder('user')
      .select('user.country')
      .where('user.id = :id', { id: userId })
      .getRawOne<{ user_country: string }>();

    const userStats = await this.statRepository.findOneBy({
      id: userId,
      mode: mode,
    });

    if (!userStats) throw new NotFoundException("User's stats not found.");

    const globalRank = await this.getUserGlobalRank(userId, mode);
    const countryRank = await this.getUserCountryRank(
      userId,
      mode,
      userCountry,
    );
    const replayViews = await this.redisClient.llen(
      `sakuru:replay_views:${GameModes[userId]}:${userId}`,
    );
    const firstPlaces = await this.redisClient.llen(
      `sakuru:firstplaces:${GameModes[userId]}:${userId}`,
    );

    const currentLevel = getLevelPrecise(userStats.tscore);
    return Object.assign(userStats, {
      global_rank: globalRank,
      country_rank: countryRank,
      replay_views: replayViews,
      first_places: firstPlaces,
      level: {
        current: toFixedNoRound(getLevelPrecise(userStats.tscore)),
        progress: currentLevel.toString().split('.')[1].slice(0, 2),
      },
    });
  }

  async getUserGlobalRank(userId: number, mode: number): Promise<number> {
    const rank = await this.redisClient.zrevrank(
      `sakuru:leaderboard:${GameModes[mode]}`,
      userId,
    );

    if (rank === null) {
      return 0;
    } else {
      return rank + 1;
    }
  }

  async getUserCountryRank(
    userId: number,
    mode: number,
    country: string,
  ): Promise<number> {
    const rank = await this.redisClient.zrevrank(
      `sakuru:leaderboard:${GameModes[mode]}:${country}`,
      userId,
    );

    if (rank === null) {
      return 0;
    } else {
      return rank + 1;
    }
  }
}
