import { Module } from '@nestjs/common';
// Импорт декоратора Module из NestJS для описания модуля

import { UserService } from './user.service';
// Импорт сервиса, где реализована бизнес-логика работы с пользователями

import { UserController } from './user.controller';
// Импорт контроллера, который обрабатывает HTTP-запросы, связанные с пользователями

@Module({
  controllers: [UserController],
  // Регистрируем контроллер UserController, который будет обрабатывать маршруты, связанные с пользователями

  providers: [UserService],
  // Регистрируем сервис UserService как провайдер, чтобы его можно было внедрять и использовать в других компонентах модуля

  exports: [UserService],
  // Экспортируем UserService, чтобы другие модули могли его использовать через импорт UserModule
})
export class UserModule {}
// Определяем и экспортируем модуль UserModule для группировки компонентов, связанных с пользователями
