import { Module } from '@nestjs/common';
import { RemoveDuplicates } from '../common/utils/remove-duplicates.service';

@Module({
  exports: [RemoveDuplicates],
  providers: [RemoveDuplicates],
})
export class UtilsModule {}
