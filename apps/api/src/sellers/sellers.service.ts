import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class SellersService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService
  ) {}
  async createSeller(userId: string, brandName: string, gstNumber?: string) {
    const seller = await this.prisma.sellerProfile.create({
      data: {
        userId,
        brandName,
        gstNumber,
      },
    });

    await this.eventsService.logEvent({
      eventType: 'SELLER_CREATED',
      userId,
      entityId: seller.id,
      payload: { brandName },
    });

    return {
      id: seller.id,
      brandName: seller.brandName,
      gstNumber: seller.gstNumber,
      status: seller.status,
      createdAt: seller.createdAt,
    };
  }

  async getSellerByUser(userId: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
    
    return seller
      ? {
          id: seller.id,
          brandName: seller.brandName,
          status: seller.status,
        }
      : null;
  }
}
