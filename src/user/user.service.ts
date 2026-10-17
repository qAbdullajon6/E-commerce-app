import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Bunday user mavjud emas!")
    }
    return user
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: createUserDto.email } })
    if (user) {
      throw new ConflictException("Bunday email mavjud!")
    }
    const createUser = await this.prisma.user.create({ data: createUserDto });
    const { password, ...withoutPass } = createUser
    return withoutPass
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Bunday user mavjud emas!")
    }
    const { password, ...withoutPass } = await this.prisma.user.update({ data: updateUserDto, where: { id } })
    return withoutPass;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Bunday user mavjud emas!")
    }
    await this.prisma.user.delete({ where: { id } })
    return { message: "Muvofaqiyatli o'chirildi" };
  }
}
