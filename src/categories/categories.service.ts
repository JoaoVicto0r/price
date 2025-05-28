import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            recipes: true,
            ingredients: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        recipes: {
          select: {
            id: true,
            name: true,
            finalCost: true,
            sellingPrice: true,
            profitMargin: true,
          },
        },
        ingredients: {
          select: {
            id: true,
            name: true,
            unitCost: true,
            stock: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Verificar se há receitas ou ingredientes usando esta categoria
    const usage = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            recipes: true,
            ingredients: true,
          },
        },
      },
    });

    if (usage && (usage._count.recipes > 0 || usage._count.ingredients > 0)) {
      throw new Error('Não é possível excluir categoria em uso');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Categoria removida com sucesso' };
  }
}