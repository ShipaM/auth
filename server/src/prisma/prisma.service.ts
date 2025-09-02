import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Создаем расширенный экземпляр PrismaClient
const prisma = new PrismaClient().$extends(withAccelerate());

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Используем расширенный клиент как приватное поле
  private readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  // Прокидываем публичный геттер для доступа к клиенту в других сервисах
  get db() {
    return this.client;
  }
}

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// // Импорт PrismaClient из сгенерированного Prisma-клиента

// @Injectable()
// // PrismaService наследуется от PrismaClient и реализует интерфейс OnModuleInit,
// // чтобы выполнить подключение к базе данных при инициализации модуля
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   // Метод, который Nest вызывает автоматически при инициализации модуля
//   async onModuleInit() {
//     // Устанавливаем соединение с базой данных через Prisma
//     await this.$connect();
//   }
// }
