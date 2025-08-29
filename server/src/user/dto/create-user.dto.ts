import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // firstName — обязательная строка с длиной от 3 до 20 символов
  @IsString({ message: 'Please enter a valid username' })
  @Length(3, 20, { message: 'Please enter from 3 to 20 characters' })
  firstName: string;

  // lastName — обязательная строка с длиной от 3 до 20 символов
  @IsString({ message: 'Please enter a valid username' })
  @Length(3, 20, { message: 'Please enter from 3 to 20 characters' })
  lastName: string;

  // username — обязательная строка с длиной от 3 до 20 символов
  @IsString({ message: 'Please enter a valid username' })
  @Length(3, 20, { message: 'Please enter from 3 to 20 characters' })
  username: string;

  // email — проверяется, что это валидный email
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  // password — проверяется, что пароль сильный:
  // хотя бы одна заглавная, одна строчная буква, цифра, спецсимвол
  @IsStrongPassword(
    {},
    {
      message:
        'Password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
    }
  )
  // Минимальная длина 8 символов
  @MinLength(8, { message: 'Password should be min 8 characters long' })
  password: string;

  // phone — обязательная строка, длина от 6 до 20 символов (можно потом улучшить регуляркой для формата телефона)
  @IsString({ message: 'Please enter a valid phone number' })
  @Length(6, 20, { message: 'Please enter from 6 to 20 characters' })
  phone: string;
}
