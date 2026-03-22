import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async createSeller(userId: string, brandName: string, gstNumber?: string) {
    const seller = await this.prisma.sellerProfile.create({
      data: {
        userId,
        brandName,
        gstNumber,
      },
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
