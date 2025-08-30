// Импорт модуля аутентификации (логика регистрации, логина и т.д.)
import { AuthModule } from '@auth/auth.module';

// Импорт декоратора Module из NestJS для определения модуля
import { Module } from '@nestjs/common';

// Импорт модуля Prisma — для работы с базой данных через Prisma ORM
import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '@auth/guards/jwt-auth-guards';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from './token/token.module';

@Module({
  // Подключаем модули, от которых зависит приложение
  imports: [
    AuthModule, // Модуль аутентификации
    PrismaModule, // Модуль для работы с базой данных
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TokenModule,
  ],
  controllers: [], // Контроллеры верхнего уровня (если есть)
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ], // Сервисы и провайдеры верхнего уровня (если есть)
})
export class AppModule {}
