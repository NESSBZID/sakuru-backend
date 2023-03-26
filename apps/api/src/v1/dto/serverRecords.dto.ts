import { GameModes } from '@shared/enums/GameModes.enum';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class ServerRecordsDto {
  @IsNotEmpty()
  @Transform(({ value }) => value[0].split(',').map((v) => parseInt(v, 10)))
  @IsArray()
  @IsEnum(GameModes, { each: true })
  @ArrayUnique()
  mode: number[];
}

export interface IServerRecordsOutput {
  name: string;
  pp_val: number;
  mode: number;
  user_id: number;
  play_time: Date;
  bmap_id: number;
  set_id: number;
}
