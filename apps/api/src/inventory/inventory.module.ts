import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PricingModule } from 'src/pricing/pricing.module';

@Module({
  imports: [PricingModule],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule {}
