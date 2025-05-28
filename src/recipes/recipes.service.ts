import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CalculatorService } from '../calculator/calculator.service';

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,
    private calculatorService: CalculatorService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, userId: number) {
    const { ingredients, ...recipeData } = createRecipeDto;

    // Criar a receita
    const recipe = await this.prisma.recipe.create({
      data: {
        ...recipeData,
        userId,
        operationalCost: createRecipeDto.operationalCost || 0,
        sellingPrice: createRecipeDto.sellingPrice || 0,
      },
    });

    // Adicionar ingredientes
    if (ingredients && ingredients.length > 0) {
      await this.addIngredientsToRecipe(recipe.id, ingredients);
    }

    // Calcular custos
    await this.calculatorService.calculateRecipeCosts(recipe.id);

    return this.findOne(recipe.id, userId);
  }

  async findAll(userId: number, categoryId?: number) {
    return this.prisma.recipe.findMany({
      where: {
        userId,
        ...(categoryId && { categoryId }),
        isActive: true,
      },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        _count: {
          select: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: {
              include: {
                category: true,
                supplier: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Receita não encontrada');
    }

    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number) {
    const recipe = await this.findOne(id, userId);
    
    const { ingredients, ...recipeData } = updateRecipeDto;

    // Atualizar dados da receita
    await this.prisma.recipe.update({
      where: { id },
      data: recipeData,
    });

    // Atualizar ingredientes se fornecidos
    if (ingredients) {
      // Remover ingredientes existentes
      await this.prisma.recipeIngredient.deleteMany({
        where: { recipeId: id },
      });

      // Adicionar novos ingredientes
      if (ingredients.length > 0) {
        await this.addIngredientsToRecipe(id, ingredients);
      }
    }

    // Recalcular custos
    await this.calculatorService.calculateRecipeCosts(id);

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const recipe = await this.findOne(id, userId);

    await this.prisma.recipe.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Receita removida com sucesso' };
  }

  private async addIngredientsToRecipe(
    recipeId: number,
    ingredients: { ingredientId: number; quantity: number }[],
  ) {
    const recipeIngredients = ingredients.map((ingredient) => ({
      recipeId,
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity,
    }));

    await this.prisma.recipeIngredient.createMany({
      data: recipeIngredients,
    });
  }

  async getRecipeStats(userId: number) {
    const [totalRecipes, activeRecipes, avgMargin, totalValue] = await Promise.all([
      this.prisma.recipe.count({
        where: { userId },
      }),
      this.prisma.recipe.count({
        where: { userId, isActive: true },
      }),
      this.prisma.recipe.aggregate({
        where: { userId, isActive: true },
        _avg: { profitMargin: true },
      }),
      this.prisma.recipe.aggregate({
        where: { userId, isActive: true },
        _sum: { finalCost: true },
      }),
    ]);

    return {
      totalRecipes,
      activeRecipes,
      inactiveRecipes: totalRecipes - activeRecipes,
      averageMargin: avgMargin._avg?.profitMargin || 0,
      totalValue: totalValue._sum?.finalCost || 0,
    };
  }
}