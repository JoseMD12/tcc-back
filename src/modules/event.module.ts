import { Module } from '@nestjs/common';
import { PrismaModule } from './database.module';
import { CreateManyEventsController } from '../common/controllers/product/event/create-many-events.controller';
import { CreateManyEventsService } from '../common/providers/product/event/create-many-events.service';
import { EventsGateway } from '../common/providers/product/event/event.gateway';
import { DeleteEventByIdController } from '../common/controllers/product/event/delete-event-by-id.controller';
import { DeleteEventByIdService } from '../common/providers/product/event/delete-event-by-id.service';

@Module({
  imports: [PrismaModule],
  controllers: [CreateManyEventsController, DeleteEventByIdController],
  providers: [CreateManyEventsService, DeleteEventByIdService, EventsGateway],
  exports: [],
})
export class EventModule {}
