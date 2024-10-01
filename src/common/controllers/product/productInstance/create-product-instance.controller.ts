import { Controller } from '@nestjs/common';

@Controller('/product-instance')
export class CreateProductInstanceController {
  constructor(
    private readonly createProductInstanceUseCase: CreateProductInstanceUseCase,
  ) {}

  @Post()
  async createProductInstance(
    @Body() createProductInstanceRequest: CreateProductInstanceRequest,
  ): Promise<CreateProductInstanceResponse> {
    return await this.createProductInstanceUseCase.execute(
      createProductInstanceRequest,
    );
  }
}
