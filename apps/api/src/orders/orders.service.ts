import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(buyerId: string, items: {
    inventoryId: string;
    quantity: number;
  }[]) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      const orderItems = [];

      for (const item of items) {
        const inventory = await tx.inventoryItem.findUnique({
          where: { id: item.inventoryId },
          include: { pricing: true },
        });

        if (!inventory) {
          throw new BadRequestException('Inventory not found');
        }

        if (inventory.quantity < item.quantity) {
          throw new BadRequestException('Insufficient stock');
        }

        const price = inventory.pricing.sellingPrice;

        total += price * item.quantity;

        orderItems.push({
          inventoryId: inventory.id,
          quantity: item.quantity,
          price,
        });

        await tx.inventoryItem.update({
          where: { id: inventory.id },
          data: {
            quantity: inventory.quantity - item.quantity,
          },
        });
      }

      return tx.order.create({
        data: {
          buyerId,
          total,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });
    });
  }

  async getOrders(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: { items: true },
    });
  }
}
