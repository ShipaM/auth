import { Module } from '@nestjs/common'; // Импорт декоратора @Module для определения модуля
import { AuthService } from './auth.service'; // Импорт сервиса аутентификации с бизнес-логикой
import { AuthController } from './auth.controller'; // Импорт контроллера для обработки HTTP-запросов аутентификации
import { UserModule } from '@user/user.module'; // Импорт модуля пользователя для взаимодействия с юзерами
import { PassportModule } from '@nestjs/passport'; // Импорт модуля Passport для стратегии аутентификации
import { JwtModule } from '@nestjs/jwt'; // Импорт JWT-модуля для работы с JSON Web Token
import { jwtModuleAsyncOptions } from 'src/config/jwt-module-config'; // Асинхронные настройки для JWT (секреты, опции)
import { JwtStrategy } from './strategy/jwt.strategy'; // Импорт стратегии JWT для проверки токенов
import { JwtAuthGuard } from './guards/jwt-auth-guards'; // Импорт guard-а для защиты маршрутов через JWT
import { TokenModule } from '@token/token.module'; // Импорт модуля для работы с токенами (refresh и пр.)

@Module({
  controllers: [AuthController], // Регистрируем контроллер — сюда придут HTTP-запросы, связанные с аутентификацией
  providers: [AuthService, JwtStrategy, JwtAuthGuard], // Регистрируем сервис аутентификации и необходимые стратегии/гварды
  imports: [
    // Подключаем модули, от которых зависит AuthModule
    UserModule, // Модуль пользователей (для доступа к юзерам)
    JwtModule.registerAsync(jwtModuleAsyncOptions()), // Настраиваем JWT-модуль асинхронно с конфигом (секреты, время жизни токена)
    PassportModule, // Модуль Passport для аутентификационных стратегий
    TokenModule, // Модуль для управления токенами (например, refresh токенами)
  ],
})
export class AuthModule {}
