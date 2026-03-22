import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 'inventory-id-123' })
  inventoryId: string;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    example: [
      {
        inventoryId: 'inventory-id-123',
        quantity: 2,
      },
    ],
  })
  items: OrderItemDto[];
}