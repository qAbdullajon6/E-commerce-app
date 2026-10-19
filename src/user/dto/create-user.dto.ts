import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @ApiProperty({ example: 'Ali Naimov' })
    @IsString()
    name: string

    @ApiProperty({ example: 'ali@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password' })
    @IsString()
    @MinLength(6)
    password: string
}
