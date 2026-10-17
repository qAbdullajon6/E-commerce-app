import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const isExist = await this.prisma.category.findUnique({ where: { name: createCategoryDto.name } })
    if (isExist) {
      throw new ConflictException('Bunday categoriya mavjud!')
    }
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({ include: { products: true } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { products: true } })
    if (!category) {
      throw new NotFoundException('Category topilmadi!')
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) {
      throw new NotFoundException('Category topilmadi!')
    }
    return this.prisma.category.update({ where: { id }, data: updateCategoryDto })
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) {
      throw new NotFoundException('Category topilmadi!')
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
