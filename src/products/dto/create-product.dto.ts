import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description: string

    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    price: number

    @IsInt()
    @IsPositive()
    stock: number

    @IsInt()
    @IsPositive()
    @IsOptional()
    categoryId?: number
}
