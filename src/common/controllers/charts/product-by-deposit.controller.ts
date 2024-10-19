import { Controller, Get } from '@nestjs/common';
import { ProductByDepositService } from '../../providers/charts/product-by-deposit.service';

@Controller('product-by-deposit')
export class ProductByDepositController {
  constructor(
    private readonly productByDepositService: ProductByDepositService,
  ) {}

  @Get()
  async getProductByDeposit() {
    return this.productByDepositService.execute();
  }
}
