import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService
  ) {}
  async createOrder(buyerId: string, items: {
    inventoryId: string;
    quantity: number;
  }[]) {
    const order = await this.prisma.$transaction(async (tx) => {
      let total = 0;

      const orderItems = [];

      for (const item of items) {
        const inventoryResult: any = await tx.$queryRawUnsafe(`
          SELECT * FROM "InventoryItem"
          WHERE id = '${item.inventoryId}'
          FOR UPDATE
        `);

        const inventory = inventoryResult[0];

        if (!inventory) {
          throw new NotFoundException('Inventory not found');
        }

        if (inventory.quantity < item.quantity) {
          throw new BadRequestException('Insufficient stock');
        }

        const pricing = await tx.inventoryPricing.findUnique({
          where: { inventoryId: inventory.id },
        });

        const price = pricing.sellingPrice;

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

    await this.eventsService.logEvent({
      eventType: 'ORDER_CREATED',
      userId: buyerId,
      entityId: order.id,
      payload: {
        total: order.total,
        items: order.items.map((item) => ({
          inventoryId: item.inventoryId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      items: order.items.map((item) => ({
        inventoryId: item.inventoryId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  async getOrders(buyerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { buyerId },
      include: { items: true },
    });

    return orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        inventoryId: item.inventoryId,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }
}
