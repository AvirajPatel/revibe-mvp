import { ApiProperty } from '@nestjs/swagger';
import { Grade } from '@prisma/client';

export class CreateInventoryDto {
  @ApiProperty({ example: 'Black T-Shirt' })
  title: string;

  @ApiProperty({ example: 'Cotton basic tee' })
  description?: string;

  @ApiProperty({ example: 'T-Shirt' })
  category: string;

  @ApiProperty({ example: 'M' })
  size: string;

  @ApiProperty({ enum: Grade, example: Grade.A })
  grade: Grade;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 1000 })
  mrp: number;
}