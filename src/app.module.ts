import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product.module';
import { PrismaModule } from './modules/database.module';
import { DepositModule } from './modules/deposit.module';
import { ProductInstanceModule } from './modules/product-instance.module';
import { EventModule } from './modules/event.module';
import { ChartsModule } from './modules/charts.module';
import { InfoCardsModule } from './modules/info-cards.module';
import { OrderModule } from './modules/order.module';

@Module({
  imports: [
    DepositModule,
    ProductModule,
    ProductInstanceModule,
    PrismaModule,
    EventModule,
    OrderModule,
    ChartsModule,
    InfoCardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
