import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role, Status } from '../auth/enums/role.enum.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @CurrentUser() user: { userId: number },
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(user.userId, createOrderDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@CurrentUser() user: { userId: number, role: string }) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: number, role: string }
  ) {
    return this.ordersService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateDto: { status: Status }) {
    return this.ordersService.update(+id, updateDto.status);
  }
}
