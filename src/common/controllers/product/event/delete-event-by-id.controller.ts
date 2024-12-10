import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteEventByIdService } from '../../../providers/product/event/delete-event-by-id.service';

@Controller('/product/event')
export class DeleteEventByIdController {
  constructor(
    private readonly deleteEventByIdService: DeleteEventByIdService,
  ) {}

  @Delete(':id')
  async execute(@Param('id') id: string) {
    return this.deleteEventByIdService.execute(id);
  }
}
