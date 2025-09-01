import {
  BadRequestException, // Исключение для ошибок клиентских запросов (400)
  Body, // Декоратор для получения тела запроса
  Controller, // Декоратор для определения контроллера
  Get, // Декоратор для обработки GET-запросов
  HttpStatus, // Перечисление с HTTP-статусами
  Logger, // Класс для логирования
  Post, // Декоратор для обработки POST-запросов
  Res, // Декоратор для получения объекта ответа (response)
} from '@nestjs/common';

import { AuthService } from './auth.service'; // Сервис с логикой аутентификации
import { RegisterDto } from './dto/register.dto'; // DTO для регистрации пользователя
import { LoginDto } from './dto/login.dto'; // DTO для логина пользователя
import { Public } from './guards/jwt-auth-guards'; // Декоратор для пометки публичных роутов (без авторизации)
import { Response } from 'express'; // Тип для объекта HTTP-ответа
import { TokenService } from '@token/token.service'; // Сервис для работы с токенами (refresh и т.д.)
import { Cookies } from '@decorators/cookies.decorator'; // Кастомный декоратор для получения cookies
import { ConfigService } from '@nestjs/config'; // Сервис для получения конфигурационных переменных
import { getCookieOptions } from '@utils/cookie-options.utils'; // Утилита для получения опций cookies

const REFRESH_TOKEN = process.env.REFRESH_TOKEN; // Имя куки с refresh токеном из env-переменной

@Public() // Помечаем весь контроллер как публичный (без JWT защиты)
@Controller('auth') // Базовый путь контроллера — все роуты начинаются с /auth
export class AuthController {
  private readonly logger = new Logger(AuthController.name); // Создаем логгер с именем контроллера

  constructor(
    private readonly authService: AuthService, // Внедряем AuthService для работы с аутентификацией
    private readonly tokenService: TokenService, // Внедряем TokenService для управления токенами
    private readonly configService: ConfigService // Внедряем ConfigService для доступа к конфигурации
  ) {}

  @Post('register') // Обработка POST-запроса на /auth/register
  async register(@Body() registerDto: RegisterDto) {
    // Получаем тело запроса и мапим в RegisterDto
    const createUser = await this.authService.register(registerDto); // Вызываем метод регистрации пользователя

    if (!createUser) {
      // Если пользователь не создался
      const message = 'Error while registration user'; // Формируем сообщение об ошибке
      this.logger.error(message); // Логируем ошибку
      throw new BadRequestException(message); // Выбрасываем исключение 400 с сообщением
    }
    return createUser; // Возвращаем данные созданного пользователя
  }

  @Post('login') // Обработка POST-запроса на /auth/login
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    // Получаем тело запроса и объект ответа
    const tokens = await this.authService.login(loginDto); // Вызываем метод логина и получаем токены

    if (!tokens) {
      // Если токены не получены (ошибка логина)
      const message = 'Error while login user'; // Формируем сообщение об ошибке
      this.logger.error(message); // Логируем ошибку
      throw new BadRequestException(message); // Выбрасываем исключение 400
    }

    this.tokenService.setRefreshTokenCookie(tokens, res); // Устанавливаем refresh токен в куки ответа
  }

  @Get('logout') // Обработка GET-запроса на /auth/logout
  async logout(
    @Cookies(REFRESH_TOKEN) refreshToken: string, // Получаем refresh токен из куки по имени
    @Res() res: Response // Получаем объект ответа
  ) {
    if (!refreshToken) {
      // Если токен отсутствует
      res.sendStatus(HttpStatus.OK); // Отправляем ответ 200 OK (выход успешен)
      return; // Завершаем метод
    }

    this.authService.deleteRefreshToken(refreshToken); // Удаляем refresh токен из БД/хранилища

    const refreshTokenName = this.configService.get('REFRESH_TOKEN'); // Получаем имя куки refresh токена из конфигурации
    const today = new Date(); // Текущая дата (для установки куки с истечением срока)

    res.cookie(refreshTokenName, '', getCookieOptions(today)); // Очищаем куки refresh токена (устанавливаем пустое значение с истекшим сроком)
    res.sendStatus(HttpStatus.OK); // Отправляем ответ 200 OK (выход успешен)
  }
}
