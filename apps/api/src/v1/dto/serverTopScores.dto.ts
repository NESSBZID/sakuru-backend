import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ModeFilter } from '../enums/ModeFilter.enum';
import { ModsFilter } from '../enums/ModsFilter.enum';

export class ServerTopScoresInput {
  @IsNotEmpty()
  @IsEnum(ModeFilter)
  mode: ModeFilter;

  @IsNotEmpty()
  @IsEnum(ModsFilter)
  mods: ModsFilter;
}

export class ServerTopScoresOutput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  pp_val: number;

  @IsNotEmpty()
  @IsNumber()
  mode: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsDateString()
  play_time: Date;

  @IsNotEmpty()
  @IsNumber()
  bmap_id: number;

  @IsNotEmpty()
  @IsNumber()
  set_id: number;
}
