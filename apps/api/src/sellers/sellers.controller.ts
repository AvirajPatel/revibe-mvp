import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createSeller(
    @Req() req,
    @Body() body: { brandName: string; gstNumber?: string },
  ) {
    const userId = req.user.userId;

    return this.sellersService.createSeller(
      userId,
      body.brandName,
      body.gstNumber,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMySeller(@Req() req) {
    return this.sellersService.getSellerByUser(req.user.userId);
  }
}
