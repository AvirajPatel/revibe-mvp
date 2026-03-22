import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { createdResponse, successResponse } from 'src/common/utils/response';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ) {
    const order = this.ordersService.createOrder(req.user.userId, body.items);
    
    return createdResponse(order);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyOrders(@Req() req) {
    const orders = this.ordersService.getOrders(req.user.userId);
    
    return successResponse(orders);
  }
}
