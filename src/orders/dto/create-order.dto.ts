import { IsArray, IsInt, IsPositive, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

class OrderItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    productId: number

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    quantity: number
}

export class CreateOrderDto {
    @ApiProperty({
        example: [
            {
                productId: 1,
                quantity: 1
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}
