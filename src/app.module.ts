import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product.module';
import { PrismaModule } from './modules/database.module';
import { DepositModule } from './modules/deposit.module';
import { ProductInstanceModule } from './modules/product-instance.module';

@Module({
  imports: [DepositModule, ProductModule, ProductInstanceModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
