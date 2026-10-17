import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto
    return this.prisma.product.create({
      data:
      {
        ...productData,
        ...(categoryId && { category: { connect: { id: categoryId } } })
      }
    });
  }

  findAll(categoryId?: number) {
    return this.prisma.product.findMany({ where: categoryId ? { categoryId: Number(categoryId) } : {}, include: { category: true } });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException("Product topilmadi!")
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException("Product topilmadi!")
    }
    return this.prisma.product.update({ data: updateProductDto, where: { id } });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException("Product topilmadi!")
    }
    return this.prisma.product.delete({ where: { id } });
  }

  async uploadImage(id: number, path: string) {
    const product = await this.prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new NotFoundException("Product topilmadi!")
    }
    return this.prisma.product.update({ where: { id }, data: { image: path } })
  }
}
