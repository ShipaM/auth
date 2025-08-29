import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Декоратор @Global() делает этот модуль глобальным —
// его провайдеры будут доступны во всём приложении без необходимости импортировать модуль в каждый модуль вручную
@Global()
@Module({
  // Регистрируем PrismaService как провайдер — Nest создаст экземпляр этого сервиса
  providers: [PrismaService],

  // Экспортируем PrismaService, чтобы он был доступен в других модулях, которые импортируют PrismaModule
  exports: [PrismaService],
})
export class PrismaModule {}
