import { Body, Controller, Post } from '@nestjs/common';
import { CreateManyEventsModel } from '../../../model/product/event/create-many-events.model';
import { CreateManyEventsService } from '../../../providers/product/event/create-many-events.service';

@Controller('/product/event')
export class CreateManyEventsController {
  constructor(
    private readonly createManyEventsService: CreateManyEventsService,
  ) {}

  @Post()
  async createManyEvents(@Body() payload: CreateManyEventsModel) {
    return this.createManyEventsService.execute(payload);
  }
}
