import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/database/prisma.service';
import { successResponse } from 'src/common/utils/response';

@Controller('inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createInventory(@Req() req, @Body() body: any) {
    const userId = req.user.userId;

    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new BadRequestException('Seller profile not found');
    }

    const data = await this.inventoryService.createInventory({
      sellerId: seller.id,
      ...body,
    });
    return successResponse(data);
  }

  @Get()
  getAllInventory() {
    const data = this.inventoryService.getAllInventory();
    return successResponse(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyInventory(@Req() req) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId: req.user.userId },
    });

    const data = await this.inventoryService.getSellerInventory(seller.id);
    return successResponse(data);
  }
}
