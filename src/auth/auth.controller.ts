import { Body, Controller, Post } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { AuthService } from './auth.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto)
    }

    @Post('/register')
    register(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.register(registerAuthDto)
    }
}
