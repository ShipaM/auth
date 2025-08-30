import { MatchPasswordsConstraint } from '@auth/validators/match-passwords-constraint';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { IsStrongPassword, MinLength, Validate } from 'class-validator';

export class RegisterDto extends CreateUserDto {
  // хотя бы одна заглавная, одна строчная буква, цифра, спецсимвол
  @IsStrongPassword(
    {},
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }
  )
  // Минимальная длина 8 символов
  @MinLength(8, { message: 'Repeat password should be min 8 characters long' })
  @Validate(MatchPasswordsConstraint)
  repeatPassword: string;
}
