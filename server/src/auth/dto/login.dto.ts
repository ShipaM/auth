import { IsString } from 'class-validator'; // Импортируем валидатор @IsString из библиотеки 'class-validator'

// Определяем Data Transfer Object (DTO) для логина — обёртка данных, которые передаются при аутентификации
export class LoginDto {
  @IsString({ message: 'Password should be a string' }) // Указывает, что поле 'password' должно быть строкой, с кастомным сообщением об ошибке
  password: string; // Поле для пароля пользователя

  @IsString({ message: 'User name should be a string' }) // А также проверка для имени пользователя — должно быть строкой
  userName: string; // Поле для имени (логина) пользователя
}
