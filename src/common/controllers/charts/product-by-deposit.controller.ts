import { Body, Controller, Get, Param } from '@nestjs/common';
import { ProductByDepositService } from '../../providers/charts/product-by-deposit.service';

@Controller('/product-by-deposit')
export class ProductByDepositController {
  constructor(
    private readonly productByDepositService: ProductByDepositService,
  ) {}

  @Get(':productId?')
  async getProductByDeposit(@Param('productId') productId?: string) {
    return this.productByDepositService.execute(productId);
  }
}
