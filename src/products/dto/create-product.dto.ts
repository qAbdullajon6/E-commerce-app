import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreateProductDto {
    @ApiProperty({ example: 'Televizor' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'Amart televizor', required: false })
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty({ example: 1500000 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number

    @ApiProperty({ example: 8 })
    @IsInt()
    @IsPositive()
    stock: number

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @IsPositive()
    @IsOptional()
    categoryId?: number
}
