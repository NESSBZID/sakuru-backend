import { Type } from 'class-transformer';
import { IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';

export default class UsersSearchDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  query: string;

  @IsNotEmpty()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  readonly limit: number = 10;

  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  readonly offset: number = 0;
}
