import { MatchPasswordsConstraint } from '@auth/validators/match-passwords-constraint';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { IsStrongPassword, MinLength, Validate } from 'class-validator';

export class RegisterDto extends CreateUserDto {
  // Проверяет, что повторённый пароль соответствует строгим требованиям безопасности:
  // - содержит хотя бы одну заглавную букву
  // - содержит хотя бы одну строчную букву
  // - содержит цифру
  // - содержит спецсимвол
  @IsStrongPassword(
    {}, // аргумент: дополнительные опции (можно оставить пустым)
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
    } // кастомное сообщение об ошибке, если правило не выполняется
  )
  // Проверяет минимальную длину поля — не менее 8 символов
  @MinLength(8, { message: 'Repeat password should be min 8 characters long' })
  // Применяет пользовательское правило валидации MatchPasswordsConstraint,
  // чтобы сравнить `repeatPassword` с основным паролем
  @Validate(MatchPasswordsConstraint)
  repeatPassword: string;
}
