import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { createdResponse, successResponse } from 'src/common/utils/response';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Auth(Role.BUYER)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ) {
    const order = await this.ordersService.createOrder(req.user.userId, body.items);
    return createdResponse(order);
  }

  @Get('my')
  async getMyOrders(@Req() req) {
    const orders = await this.ordersService.getOrders(req.user.userId);
    return successResponse(orders);
  }
}
