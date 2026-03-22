import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
  @ApiProperty({ example: 'Aviraj Fashion' })
  brandName: string;

  @ApiProperty({ example: 'GST123456', required: false })
  gstNumber?: string;
}