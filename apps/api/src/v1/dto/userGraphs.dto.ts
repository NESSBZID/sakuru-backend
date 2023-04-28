import { GameModes } from '@shared/enums/GameModes.enum';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum } from 'class-validator';

export default class UserGraphsGetDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsEnum(GameModes)
  mode: GameModes;
}
