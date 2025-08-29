import { IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Password should be a string' })
  password: string;

  @IsString({ message: 'User name should be a string' })
  username: string;
}
