import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from 'src/database/prisma.service';
import { successResponse } from 'src/common/utils/response';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private prisma: PrismaService,
  ) {}

  @Auth(Role.SELLER)
  @Post()
  async createInventory(@Req() req, @Body() body: any) {
    const userId = req.user.userId;

    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    const data = await this.inventoryService.createInventory({
      sellerId: seller.id,
      ...body,
    });
    return successResponse(data);
  }

  @Get()
  async getAllInventory() {
    const data = await this.inventoryService.getAllInventory();
    return successResponse(data);
  }

  @Auth(Role.SELLER)
  @Get('my')
  async getMyInventory(@Req() req) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId: req.user.userId },
    });

    const data = await this.inventoryService.getSellerInventory(seller.id);
    return successResponse(data);
  }
}
