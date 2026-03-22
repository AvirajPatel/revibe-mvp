import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { createdResponse, successResponse } from 'src/common/utils/response';
import { Role } from 'src/common/enums/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSellerDto } from './dto/create-seller.dto';

@ApiTags('Sellers')
@ApiBearerAuth('access-token')
@Auth(Role.SELLER)
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Post()
  async createSeller(
    @Req() req,
    @Body() body: CreateSellerDto,
  ) {
    const userId = req.user.userId;

    const seller = await this.sellersService.createSeller(
      userId,
      body.brandName,
      body.gstNumber,
    );
    return createdResponse(seller);
  }

  @Get('me')
  async getMySeller(@Req() req) {
    const seller = await this.sellersService.getSellerByUser(req.user.userId);
    return successResponse(seller);
  }
}
