import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateManyEventsController } from '../common/controllers/product/event/create-many-events.controller';
import { CreateManyEventsService } from '../common/providers/product/event/create-many-events.service';

@Module({
  imports: [PrismaModule],
  controllers: [CreateManyEventsController],
  providers: [CreateManyEventsService],
  exports: [],
})
export class EventModule {}
