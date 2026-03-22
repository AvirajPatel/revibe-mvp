import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(req.user.userId, body.items);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyOrders(@Req() req) {
    return this.ordersService.getOrders(req.user.userId);
  }
}
