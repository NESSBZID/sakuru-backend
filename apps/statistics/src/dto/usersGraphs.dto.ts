import { GameModes } from '@shared/enums/GameModes.enum';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsArray, IsEnum, ArrayUnique } from 'class-validator';

export default class UsersGraphsGetMessageDto {
  @IsNotEmpty()
  @Type(() => Number)
  user_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => value[0].split(',').map((v) => parseInt(v, 10)))
  @IsArray()
  @IsEnum(GameModes, { each: true })
  @ArrayUnique()
  mode: GameModes;
}
