import { Controller, Get, Res, UnauthorizedException } from '@nestjs/common';
// Импорт контроллера, декоратора GET, объекта ответа и исключения 401 Unauthorized

import { TokenService } from './token.service';
// Импорт сервиса, который отвечает за логику работы с токенами

import { Public } from '@auth/guards/jwt-auth-guards';
// Декоратор, который помечает маршрут как публичный (без проверки JWT)

import { Cookies } from '@decorators/cookies.decorator';
// Кастомный декоратор для получения куки из запроса

import { Response } from 'express';
// Тип для объекта ответа Express

const { REFRESH_TOKEN } = process.env;
// Берём название куки с refresh токеном из переменных окружения

@Public() // Метка, что все маршруты этого контроллера публичны (без авторизации)
@Controller('token') // Контроллер с базовым маршрутом /token
export class TokenController {
  private readonly refreshToken: string; // (Не используется в коде, можно удалить)

  constructor(private readonly tokenService: TokenService) {}
  // Внедряем TokenService для работы с токенами

  @Get('refresh-tokens') // Обрабатывает GET-запрос на /token/refresh-tokens
  async refreshTokens(
    @Cookies(REFRESH_TOKEN) refreshToken: string, // Получаем refresh токен из куки
    @Res() res: Response // Получаем объект HTTP-ответа
  ) {
    if (!refreshToken) {
      // Если токена нет в куках
      throw new UnauthorizedException(); // Бросаем 401 ошибку — пользователь не авторизован
    }

    const tokens = await this.tokenService.refreshTokens(refreshToken);
    // Вызываем сервис для обновления токенов по refresh токену

    if (!tokens) {
      // Если новые токены не получены (например, токен просрочен)
      throw new UnauthorizedException(); // Снова выбрасываем 401 ошибку
    }

    this.tokenService.setRefreshTokenCookie(tokens, res);
    // Устанавливаем новый refresh токен в куки ответа
  }
}
