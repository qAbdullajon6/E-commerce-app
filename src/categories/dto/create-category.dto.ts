import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronika' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'Elektron qurilmalar', required: false })
    @IsString()
    @IsOptional()
    description?: string
}
