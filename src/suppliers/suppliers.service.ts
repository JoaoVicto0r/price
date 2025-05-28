import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto, userId: number) {
    return this.prisma.supplier.create({
      data: {
        ...createSupplierDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.supplier.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, userId: number) {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        ingredients: {
          select: {
            id: true,
            name: true,
            unitCost: true,
            stock: true,
            unit: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado');
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });
  }

  async remove(id: string, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Fornecedor removido com sucesso' };
  }
}