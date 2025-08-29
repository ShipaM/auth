// Импорт модуля аутентификации (логика регистрации, логина и т.д.)
import { AuthModule } from '@auth/auth.module';

// Импорт декоратора Module из NestJS для определения модуля
import { Module } from '@nestjs/common';

// Импорт модуля Prisma — для работы с базой данных через Prisma ORM
import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  // Подключаем модули, от которых зависит приложение
  imports: [
    AuthModule, // Модуль аутентификации
    PrismaModule, UserModule, // Модуль для работы с базой данных
  ],
  controllers: [], // Контроллеры верхнего уровня (если есть)
  providers: [], // Сервисы и провайдеры верхнего уровня (если есть)
})
export class AppModule {}
