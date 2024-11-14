import { Controller, Get, Query } from '@nestjs/common';
import { MovingInstancesService } from '../../providers/charts/moving-instances.service';
import { MovimentationType } from '../../model/deposit/movimentation-type';

@Controller('/moving-instances')
export class MovingInstancesController {
  constructor(
    private readonly movingInstancesService: MovingInstancesService,
  ) {}

  @Get()
  async execute(
    @Query('movingType') movingType: MovimentationType,
    @Query('depositId') depositId?: string,
    @Query('search') search?: string,
  ) {
    return this.movingInstancesService.execute(movingType, depositId, search);
  }
}
