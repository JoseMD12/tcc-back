import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { StockProjectionService } from '../../providers/charts/stock-projection.service';

@Controller('/stock-projection')
export class StockProjectionController {
  constructor(
    private readonly stockProjectionService: StockProjectionService,
  ) {}

  @Get()
  async getStockProjection(
    @Query('productId') productId: string,
    @Query('newOrdersState') newOrdersState: boolean,
    @Query('depositId') depositId?: string,
  ) {
    if (!productId) {
      throw new BadRequestException('ProductId parameter is required');
    }

    return this.stockProjectionService.getStockProjection(
      productId,
      newOrdersState,
      depositId,
    );
  }
}
