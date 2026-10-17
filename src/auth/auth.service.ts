import { UnauthorizedException, Injectable, ConflictException } from '@nestjs/common';
import bcrypt from "bcrypt"
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) { }

    async login(loginAuthDto: LoginAuthDto) {
        const user = await this.prisma.user.findUnique({ where: { email: loginAuthDto.email } })
        if (!user) {
            throw new UnauthorizedException("Login yoki parrol nato'g'ri")
        }
        const isMatch = await bcrypt.compare(loginAuthDto.password, user.password)
        if (!isMatch) {
            throw new UnauthorizedException("Login yoki parrol nato'g'ri")
        }
        const token = this.jwt.sign({
            sub: user.id,
            role: user.role
        })
        const { password, ...withoutPass } = user
        return { user: withoutPass, token }
    }

    async register(registerAuthDto: RegisterAuthDto) {
        const user = await this.prisma.user.findUnique({ where: { email: registerAuthDto.email } })
        if (user) {
            throw new ConflictException("Email allaqchon mavjud!")
        }
        const hash = await bcrypt.hash(registerAuthDto.password, 10)
        const createUser = await this.prisma.user.create({ data: { ...registerAuthDto, password: hash } })
        const token = this.jwt.sign({
            sub: createUser.id,
            role: createUser.role
        })
        const { password, ...withoutPass } = createUser
        return { user: withoutPass, token }
    }
}
