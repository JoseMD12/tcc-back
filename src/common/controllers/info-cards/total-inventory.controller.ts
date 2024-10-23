import { Controller, Get } from '@nestjs/common';
import { TotalInventoryService } from '../../providers/info-cards/total-inventory.service';

@Controller('/total-inventory')
export class TotalInventoryController {
  constructor(private readonly totalInventoryService: TotalInventoryService) {}

  @Get()
  async totalInventory() {
    return await this.totalInventoryService.execute();
  }
}
