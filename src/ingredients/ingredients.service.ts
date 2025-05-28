import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredients.dto';
import { UpdateIngredientDto } from './dto/update-ingredients.dto';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto, userId: number) {
    return this.prisma.ingredient.create({
      data: {
        ...createIngredientDto,
        userId,
      },
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async findAll(userId: number, categoryId?: number, lowStock?: boolean) {
    return this.prisma.ingredient.findMany({
      where: {
        userId,
        isActive: true,
        ...(categoryId && { categoryId }),
        ...(lowStock && {
          stock: {
            lte: this.prisma.ingredient.fields.minStock,
          },
        }),
      },
      include: {
        category: true,
        supplier: true,
        _count: {
          select: {
            recipeIngredients: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const ingredient = await this.prisma.ingredient.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        supplier: true,
        recipeIngredients: {
          include: {
            recipe: {
              select: {
                id: true,
                name: true,
                servings: true,
              },
            },
          },
        },
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente não encontrado');
    }

    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.ingredient.update({
      where: { id },
      data: updateIngredientDto,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    await this.prisma.ingredient.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Ingrediente removido com sucesso' };
  }

  async updateStock(id: number, quantity: number, userId: number, operation: 'add' | 'subtract' = 'add') {
    const ingredient = await this.findOne(id, userId);

    const newStock = operation === 'add' 
      ? ingredient.stock + quantity 
      : ingredient.stock - quantity;

    if (newStock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }

    return this.prisma.ingredient.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async getStockAlert(userId: number) {
    const lowStockIngredients = await this.prisma.ingredient.findMany({
      where: {
        userId,
        isActive: true,
        stock: {
          lte: this.prisma.ingredient.fields.minStock,
        },
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    const expiringSoon = await this.prisma.ingredient.findMany({
      where: {
        userId,
        isActive: true,
        expirationDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    return {
      lowStock: lowStockIngredients,
      expiringSoon,
      alerts: {
        lowStockCount: lowStockIngredients.length,
        expiringSoonCount: expiringSoon.length,
      },
    };
  }

  async getIngredientStats(userId: number) {
    const [total, lowStock, totalValue, categories] = await Promise.all([
      this.prisma.ingredient.count({
        where: { userId, isActive: true },
      }),
      this.prisma.ingredient.count({
        where: {
          userId,
          isActive: true,
          stock: {
            lte: this.prisma.ingredient.fields.minStock,
          },
        },
      }),
      this.prisma.ingredient.aggregate({
        where: { userId, isActive: true },
        _sum: {
          stock: true,
        },
      }),
      this.prisma.ingredient.groupBy({
        by: ['categoryId'],
        where: { userId, isActive: true },
        _count: true,
      }),
    ]);

    return {
      totalIngredients: total,
      lowStockCount: lowStock,
      totalStockValue: totalValue._sum?.stock || 0,
      categoriesCount: categories.length,
    };
  }
}