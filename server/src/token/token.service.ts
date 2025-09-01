import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
// HttpStatus — для удобных HTTP кодов,
// Injectable — чтобы Nest мог внедрять сервис,
// UnauthorizedException — ошибка 401 для случаев неавторизации

import { JwtService } from '@nestjs/jwt';
// Сервис JWT для создания и проверки JWT токенов

import { Token, User } from '@prisma/client';
// Типы Token и User из Prisma ORM

import { PrismaService } from '@prisma/prisma.service';
// Сервис для работы с БД через Prisma

import { UserService } from '@user/user.service';
// Сервис для работы с пользователями

import * as dayjs from 'dayjs';
// Библиотека для работы с датами

import { Tokens, CookieOptions } from './types/type';
// Типы Tokens (пары access+refresh токенов) и CookieOptions (опции куки)

import { Response } from 'express';
// Тип ответа Express

import { v4 } from 'uuid';
// Для генерации уникального UUID (используется для refresh токенов)

import { ConfigService } from '@nestjs/config';
// Для доступа к конфигурации из env

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService, // Для поиска пользователя по ID
    private readonly jwtService: JwtService, // Для генерации JWT access токенов
    private readonly prismaService: PrismaService, // Для работы с таблицей токенов в БД
    private readonly config: ConfigService // Для конфигурационных значений (например, время жизни токена)
  ) {}

  // Метод обновления токенов по refresh токену
  async refreshTokens(refreshToken: string): Promise<Tokens> {
    // Пытаемся удалить refresh токен из БД, если не получилось — вернём null
    const token = await this.prismaService.token
      .delete({
        where: { token: refreshToken }, // Удаляем токен по его значению
      })
      .catch((err) => null);

    const today = dayjs(); // Текущая дата
    const expDate = dayjs(token.expires); // Дата истечения токена из БД
    const isExpired = expDate.isBefore(today); // Проверяем, истек ли токен

    if (!token.expires || isExpired) {
      // Если нет даты истечения или токен просрочен
      throw new UnauthorizedException(); // Бросаем ошибку 401 — неавторизован
    }

    const user = await this.userService.findById(token.userId);
    // Ищем пользователя по ID из токена

    return this.generateTokens(user); // Генерируем новую пару токенов (access и refresh)
  }

  // Метод генерации access и refresh токенов
  generateTokens = async (user: User): Promise<Tokens> => {
    // Создаем access токен с полезной нагрузкой (payload)
    const accessToken = this.jwtService.sign({
      userId: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    });

    // Создаем новый refresh токен в БД
    const refreshToken: Token = await this.getRefreshToken(user.id);

    const tokens = { accessToken, refreshToken }; // Собираем пару токенов

    return tokens; // Возвращаем пару токенов
  };

  // Метод для установки refresh токена в куки и отправки access токена в ответе
  setRefreshTokenCookie(tokens: Tokens, res: Response) {
    if (!tokens) {
      // Если токены отсутствуют
      throw new UnauthorizedException(); // Бросаем ошибку 401
    }

    const { token, expires } = tokens.refreshToken; // Берём refresh токен и время его истечения

    const cookieExpDate = dayjs(expires).toDate(); // Преобразуем дату истечения в Date

    // Опции куки для безопасности и срока действия
    const CookieOptions: CookieOptions = {
      httpOnly: true, // Куки доступны только серверу (JS в браузере не может прочитать)
      sameSite: 'lax', // Защита от CSRF атак с использованием куков
      secure: false, // В продакшене нужно ставить true (https)
      path: '/', // Куки доступны по всему сайту
      expires: cookieExpDate, // Время истечения куки совпадает с refresh токеном
    };

    const refreshToken = this.config.get('REFRESH_TOKEN'); // Название куки из конфигурации

    res.cookie(refreshToken, token, CookieOptions); // Устанавливаем куки с refresh токеном
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    // Отправляем в теле ответа access токен с HTTP статусом 201 Created
  }

  // Вспомогательный приватный метод для создания refresh токена в БД
  private getRefreshToken = async (userId: string): Promise<Token> => {
    const currentDate = dayjs(); // Текущая дата

    const expirationUnit = this.config.get('TOKEN_EXPIRATION_UNIT');
    const expirationValue = this.config.get('TOKEN_EXPIRATION_VALUE');
    // Получаем из конфига единицу времени (например, 'days') и значение (например, 7)

    const expireDate = currentDate
      .add(expirationValue, expirationUnit) // Добавляем время жизни токена к текущей дате
      .toDate();

    // Создаем запись в таблице токенов с UUID, датой истечения и ID пользователя
    return await this.prismaService.token.create({
      data: {
        token: v4(), // Генерируем уникальный UUID
        expires: expireDate, // Устанавливаем время истечения токена
        userId, // Связываем токен с пользователем
      },
    });
  };
}
