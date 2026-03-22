import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { createdResponse, successResponse } from 'src/common/utils/response';

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

    const seller = this.sellersService.createSeller(
      userId,
      body.brandName,
      body.gstNumber,
    );
    
    return createdResponse(seller);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMySeller(@Req() req) {
    const seller = this.sellersService.getSellerByUser(req.user.userId);
    
    return successResponse(seller);
  }
}
