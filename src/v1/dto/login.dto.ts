import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class LoginDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
