import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// Импорт PrismaClient из сгенерированного Prisma-клиента

@Injectable()
// PrismaService наследуется от PrismaClient и реализует интерфейс OnModuleInit,
// чтобы выполнить подключение к базе данных при инициализации модуля
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Метод, который Nest вызывает автоматически при инициализации модуля
  async onModuleInit() {
    // Устанавливаем соединение с базой данных через Prisma
    await this.$connect();
  }
}
