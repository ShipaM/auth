import { ExtractJwt, Strategy } from 'passport-jwt'; // Импорт стратегии JWT и вспомогательных функций
import { PassportStrategy } from '@nestjs/passport'; // Базовый класс для создания стратегий Passport в NestJS
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'; // Стандартные утилиты NestJS
import { ConfigService } from '@nestjs/config'; // Сервис для работы с конфигами (например, переменные окружения)
import { User } from '@prisma/client'; // Тип User из Prisma Client
import { UserService } from '@user/user.service'; // Сервис для работы с пользователями (запросы к базе)
import { JWTPayload } from '@auth/types/types'; // Тип для полезной нагрузки JWT


//Конструктор настраивает стратегию Passport-JWT с секретом и способом извлечения токена из заголовка.

//Метод validate вызывается Passport'ом автоматически после проверки токена. Если пользователь с указанным ID существует, возвращаем полезную нагрузку (payload), иначе кидаем ошибку 401 Unauthorized.

//Если validate возвращает что-то — Nest автоматически кладет это в request.user для дальнейшего использования в контроллерах.
@Injectable()
// Класс стратегии для проверки JWT-токена
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name); // Логгер для вывода сообщений и ошибок с именем класса

  constructor(
    private readonly configService: ConfigService, // Для доступа к конфигурации (секретный ключ)
    private readonly userService: UserService // Для поиска пользователя в базе
  ) {
    super({
      // Настройки для стратегии:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлекаем JWT из заголовка Authorization Bearer
      ignoreExpiration: false, // Не игнорируем срок действия токена
      secretOrKey: configService.get('JWT_SECRET'), // Секретный ключ для проверки подписи токена
    });
  }

  // Метод validate вызывается автоматически после успешной проверки подписи JWT
  // В него передается полезная нагрузка токена (payload)
  async validate(jwtPayload: JWTPayload) {
    // Пытаемся найти пользователя по ID, который передан в JWT (jwtPayload.userId)
    const user: User = await this.userService
      .findById(jwtPayload.userId)
      .catch((err) => {
        this.logger.error(err); // Логируем ошибку, если не удалось получить пользователя
        return null; // Возвращаем null, чтобы потом обработать отсутствие пользователя
      });

    // Если пользователь не найден, выбрасываем исключение Unauthorized
    if (!user) {
      throw new UnauthorizedException();
    }

    // Возвращаем полезную нагрузку токена (можно вернуть и объект пользователя, если нужно)
    return jwtPayload;
  }
}
