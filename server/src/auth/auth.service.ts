import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
// Injectable — чтобы NestJS мог внедрять зависимости в этот сервис
// Logger — для логирования действий и ошибок
// UnauthorizedException — исключение для ошибок авторизации (401)

import { UserService } from '@user/user.service'; // Сервис для работы с пользователями (CRUD и др.)
import { RegisterDto } from './dto/register.dto'; // DTO для регистрации пользователя
import { LoginDto } from './dto/login.dto'; // DTO для логина пользователя
import { compareSync } from 'bcrypt'; // Синхронная функция для сравнения паролей (хэш)
import { User } from '@prisma/client'; // Тип User из Prisma клиента (модель пользователя)
import { PrismaService } from '@prisma/prisma.service'; // Сервис для работы с БД через Prisma
import * as dayjs from 'dayjs'; // Библиотека для работы с датами (не используется в коде)
import { v4 } from 'uuid'; // Генерация UUID (не используется в коде)
import { ConfigService } from '@nestjs/config'; // Для работы с конфигурацией приложения
import { TokenService } from '@token/token.service'; // Сервис для генерации и управления токенами
import { Tokens } from '@token/types/type'; // Тип данных для возвращаемых токенов (access и refresh)

@Injectable() // Делает класс доступным для DI (внедрение зависимостей)
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Создаем экземпляр логгера с именем класса

  constructor(
    private readonly userService: UserService, // Внедряем UserService для управления юзерами
    private readonly prismaService: PrismaService, // Внедряем PrismaService для работы с БД напрямую (токены)
    private readonly config: ConfigService, // Внедряем ConfigService для доступа к конфигу
    private readonly tokenService: TokenService // Внедряем TokenService для генерации токенов
  ) {}

  /**
   * Метод регистрации пользователя.
   * Принимает DTO с данными регистрации и создает нового пользователя.
   * @param registerDto - данные регистрации (имя, email, пароль и т.п.)
   * @returns Promise<User> - созданный пользователь
   */
  register(registerDto: RegisterDto): Promise<User> {
    const createUserDto = registerDto; // Копируем DTO (можно для дальнейших изменений)

    delete createUserDto.repeatPassword; // Удаляем поле повторного пароля, оно не нужно для БД

    const createdUser = this.userService.create(createUserDto); // Создаем пользователя через UserService

    return createdUser; // Возвращаем Promise с созданным пользователем
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { userName, password } = loginDto; // Получаем имя пользователя и пароль из DTO

    // Пытаемся найти пользователя по имени, ловим ошибки и логируем
    const user: User = await this.userService
      .findByUserName(userName)
      .catch((err) => {
        this.logger.error('Error while finding user by user name', err);
        return null; // При ошибке возвращаем null, чтобы не ломать поток
      });

    // Сравниваем переданный пароль с хэшем в базе (user.password)
    const isPasswordMatch = user && compareSync(password, user.password);

    if (!user || !isPasswordMatch) {
      // Если пользователь не найден или пароль не совпал
      const message = 'Incorrect login or password';
      this.logger.error(message); // Логируем ошибку
      throw new UnauthorizedException(message); // Бросаем исключение 401 Unauthorized
    }

    // Если логин и пароль верны — генерируем и возвращаем токены (access и refresh)
    return this.tokenService.generateTokens(user);
  }

  async deleteRefreshToken(refreshToken: string) {
    // Проверяем наличие refresh токена в базе (через Prisma)
    const token = await this.prismaService.token.findUnique({
      where: { token: refreshToken }, // Ищем по значению токена
    });

    if (!token) {
      // Если токен не найден
      this.logger.warn(`Refresh token not found for deletion: ${refreshToken}`); // Логируем предупреждение
      return; // Завершаем без ошибки
    }

    // Если токен найден — удаляем его из базы
    await this.prismaService.token.delete({
      where: { token: refreshToken },
    });
  }
}
