import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { SellersModule } from './sellers/sellers.module';
import { InventoryModule } from './inventory/inventory.module';
import { PricingModule } from './pricing/pricing.module';
import { OrdersModule } from './orders/orders.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    UsersModule, 
    SellersModule, 
    InventoryModule, 
    PricingModule, 
    OrdersModule, 
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
