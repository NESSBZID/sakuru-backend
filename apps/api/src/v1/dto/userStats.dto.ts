import { StatEntity } from '@shared/entities';
import { GameModes } from '@shared/enums/GameModes.enum';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';

export default class UserStatsGetDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(GameModes)
  mode: GameModes;
}

export type IUserStatsResponse = StatEntity & {
  global_rank: number;
  country_rank: number;
  replay_views: number;
  first_places: number;
  level: {
    current: number;
    progress: number;
  };
};
