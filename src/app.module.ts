import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product.module';
import { PrismaModule } from './modules/database.module';

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
