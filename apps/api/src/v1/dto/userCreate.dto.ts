import { Match } from '@shared/decorators/match.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Match('password')
  confirm_password: string;

  @IsNotEmpty()
  @IsString()
  captcha_token: string;
}
