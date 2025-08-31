import { CreateUserDto } from '@user/dto/create-user.dto';
// Импорт DTO для создания пользователя — нужен, чтобы получить доступ к свойствам объекта при валидации

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// Импорты из class-validator для создания кастомного валидатора

//Этот класс — кастомный валидатор, который проверяет, что поле repeatPassword совпадает с password в одном объекте (CreateUserDto).

//Если пароли не совпадают — возвращается сообщение об ошибке.

//Используется синхронная валидация.

@ValidatorConstraint({ async: false })
// Декоратор, который объявляет этот класс кастомным валидатором
// async: false — валидатор работает синхронно
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  // Метод validate вызывается автоматически при валидации поля (в данном случае — repeatPassword)
  validate(repeatPassword: string, args: ValidationArguments) {
    // Получаем значение поля password из объекта, который валидируется (CreateUserDto)
    const { password } = args.object as CreateUserDto;

    // Проверяем, что пароль и повторный пароль совпадают
    return password === repeatPassword;
  }

  // Сообщение об ошибке, которое будет показано, если пароли не совпадают
  defaultMessage(): string {
    return 'Entered passwords do not match';
  }
}
