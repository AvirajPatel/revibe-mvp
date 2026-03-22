import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async createSeller(userId: string, brandName: string, gstNumber?: string) {
    return this.prisma.sellerProfile.create({
      data: {
        userId,
        brandName,
        gstNumber,
      },
    });
  }

  async getSellerByUser(userId: string) {
    return this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
  }
}
