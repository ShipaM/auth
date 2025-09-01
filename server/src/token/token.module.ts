import { Module } from '@nestjs/common';
// Импорт декоратора @Module для объявления модуля

import { TokenService } from './token.service';
// Импорт сервиса, который реализует логику работы с токенами (генерация, обновление, валидация)

import { TokenController } from './token.controller';
// Импорт контроллера для обработки HTTP-запросов, связанных с токенами (например, обновление токенов)

import { PrismaService } from '@prisma/prisma.service';
// Сервис для работы с базой данных через Prisma ORM (используется для сохранения токенов и др.)

import { UserModule } from '@user/user.module';
// Модуль пользователей — для доступа к функционалу пользователей внутри TokenModule

import { ConfigModule } from '@nestjs/config';
// Модуль конфигурации для загрузки env-переменных и других настроек

import { JwtModule } from '@nestjs/jwt';
// Модуль для работы с JWT (создание, проверка токенов)

import { jwtModuleAsyncOptions } from 'src/config/jwt-module-config';
// Асинхронные настройки JWT-модуля (секреты, время жизни), конфигурируются динамически

@Module({
  controllers: [TokenController], // Регистрируем контроллер, который принимает HTTP-запросы на токены
  providers: [TokenService, PrismaService], // Регистрируем сервисы, которые реализуют бизнес-логику и работу с БД
  exports: [TokenService], // Экспортируем TokenService, чтобы другие модули могли его использовать
  imports: [
    UserModule, // Импортируем UserModule для доступа к пользователям
    ConfigModule, // Импортируем ConfigModule для доступа к настройкам приложения
    JwtModule.registerAsync(jwtModuleAsyncOptions()), // Асинхронно регистрируем JwtModule с конфигурацией из env
  ],
})
export class TokenModule {}
