import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Decimal } from '@prisma/client/runtime/library';
import { Status } from '../auth/enums/role.enum.js';
import { Prisma } from '@prisma/client';

interface OrderItem {
  product: {
    id: number,
    price: Decimal,
    stock: number
  },
  quantity: number
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, dto: CreateOrderDto) {
    const orderItems: OrderItem[] = []
    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} topilmadi!`)
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`${product.name} da yetarli maxsulot yoq. Mavjud: ${product.stock}`)
      }
      orderItems.push({ product, quantity: item.quantity })
    }
    const totalPrice = orderItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          orderItems: {
            create: orderItems.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: { orderItems: true }
      })
      for (const item of orderItems) {
        await tx.product.update({ where: { id: item.product.id }, data: { stock: item.product.stock - item.quantity } })
      }
      return order
    });
  }

  findAll(user: { userId: number, role: string }) {
    if (user.role === "ADMIN") {
      return this.prisma.order.findMany({ include: { orderItems: true } })
    }
    return this.prisma.order.findMany({ where: { userId: user.userId }, include: { orderItems: true } });
  }

  async findOne(id: number, user: { userId: number, role: string }) {
    const order = user.role === 'ADMIN'
      ? await this.prisma.order.findUnique({ where: { id }, include: { orderItems: true } })
      : await this.prisma.order.findUnique({ where: { id, userId: user.userId }, include: { orderItems: true } })

    if (!order) {
      throw new NotFoundException('Order topilmadi!')
    }
    return order;
  }

  async update(id: number, status: Status) {
    const order = await this.prisma.order.findUnique({ where: { id } })
    if (!order) {
      throw new NotFoundException('Order mavjud emas!')
    }
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}
