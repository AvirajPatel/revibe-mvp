import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PricingService } from 'src/pricing/pricing.service';
import { Grade } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}

  async createInventory(data: {
    sellerId: string;
    title: string;
    description?: string;
    category: string;
    size: string;
    grade: Grade;
    quantity: number;
    mrp: number;
  }) {
    const price = this.pricingService.calculatePrice(
      data.mrp,
      data.grade,
      0,
    );

    return this.prisma.inventoryItem.create({
      data: {
        ...data,
        pricing: {
          create: {
            sellingPrice: price,
          },
        },
      },
      include: {
        pricing: true,
      },
    });
  }

  async getAllInventory() {
    return this.prisma.inventoryItem.findMany({
      include: {
        pricing: true,
        seller: true,
      },
    });
  }

  async getSellerInventory(sellerId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { sellerId },
      include: { pricing: true },
    });
  }
}
