// Импорт NestFactory для создания приложения на NestJS
import { NestFactory } from '@nestjs/core';

// Импорт корневого модуля приложения
import { AppModule } from './app.module';

// Импорт настроек CORS (Cross-Origin Resource Sharing)
import { corsOptions } from './config/cors-options.config';

// Импорт ValidationPipe — встроенного пайпа для валидации DTO
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// Устанавливаем порт: либо из переменной окружения, либо по умолчанию 1111
const PORT = process.env.PORT ?? 1111;

// Асинхронная функция bootstrap — точка входа приложения
async function bootstrap() {
  // Создаём экземпляр приложения NestJS с указанным модулем
  const app = await NestFactory.create(AppModule);

  // Включаем CORS с заданными параметрами (разрешаем запросы с других источников)
  app.enableCors(corsOptions);

  // Устанавливаем префикс для всех маршрутов, например: /api/users вместо /users
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  // Подключаем глобальный пайп валидации для всех входящих данных (например, DTO)
  app.useGlobalPipes(new ValidationPipe());

  // Запускаем приложение на указанном порту
  await app.listen(PORT);

  // Запускаем сервер на указанном порту и выводим сообщение в консоль
  Logger.log(`Server started on port ${PORT}`);
}

// Запуск приложения
bootstrap();
