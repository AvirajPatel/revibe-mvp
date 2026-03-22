import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/database/prisma.service';

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
      throw new Error('Seller profile not found');
    }

    return this.inventoryService.createInventory({
      sellerId: seller.id,
      ...body,
    });
  }

  @Get()
  getAllInventory() {
    return this.inventoryService.getAllInventory();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyInventory(@Req() req) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId: req.user.userId },
    });

    return this.inventoryService.getSellerInventory(seller.id);
  }
}
