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

    const item = await this.prisma.inventoryItem.create({
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

    return {
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.pricing?.sellingPrice,
    };
  }

  async getAllInventory() {
    const items = await this.prisma.inventoryItem.findMany({
      include: {
        pricing: true,
        seller: true,
      },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      size: item.size,
      grade: item.grade,
      quantity: item.quantity,
      price: item.pricing?.sellingPrice,
      sellerBrand: item.seller?.brandName,
    }));
  }

  async getSellerInventory(sellerId: string) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { sellerId },
      include: { pricing: true },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      size: item.size,
      grade: item.grade,
      quantity: item.quantity,
      price: item.pricing?.sellingPrice,
    }));
  }
}
