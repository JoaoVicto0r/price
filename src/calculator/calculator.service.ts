import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalculatorService {
  constructor(private prisma: PrismaService) {}

  async calculateRecipeCosts(recipeId: number) {
    // Buscar a receita com ingredientes
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new Error('Receita não encontrada');
    }

    // Calcular custo total dos ingredientes
    let totalIngredientsCost = 0;

    for (const recipeIngredient of recipe.ingredients) {
      const ingredientCost = recipeIngredient.quantity * recipeIngredient.ingredient.unitCost;
      
      // Atualizar o custo do ingrediente na receita
      await this.prisma.recipeIngredient.update({
        where: { id: recipeIngredient.id },
        data: { cost: ingredientCost },
      });

      totalIngredientsCost += ingredientCost;
    }

    // Calcular custo final (ingredientes + operacional)
    const finalCost = totalIngredientsCost + recipe.operationalCost;

    // Calcular margem de lucro e lucro líquido
    let profitMargin = 0;
    let netProfit = 0;

    if (recipe.sellingPrice > 0) {
      netProfit = recipe.sellingPrice - finalCost;
      profitMargin = (netProfit / recipe.sellingPrice) * 100;
    }

    // Atualizar a receita com os custos calculados
    const updatedRecipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: {
        totalCost: totalIngredientsCost,
        finalCost,
        profitMargin,
        netProfit,
      },
    });

    return {
      totalCost: totalIngredientsCost,
      operationalCost: recipe.operationalCost,
      finalCost,
      sellingPrice: recipe.sellingPrice,
      profitMargin,
      netProfit,
      costPerServing: finalCost / recipe.servings,
      pricePerServing: recipe.sellingPrice / recipe.servings,
    };
  }

  async calculateIngredientUsage(ingredientId: number, userId: number) {
    const usage = await this.prisma.recipeIngredient.findMany({
      where: {
        ingredientId,
        recipe: {
          userId,
          isActive: true,
        },
      },
      include: {
        recipe: {
          select: {
            id: true,
            name: true,
            servings: true,
          },
        },
      },
    });

    const totalUsage = usage.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalUsage,
      recipesCount: usage.length,
      recipes: usage.map(item => ({
        recipeId: item.recipe.id,
        recipeName: item.recipe.name,
        quantity: item.quantity,
        cost: item.cost,
      })),
    };
  }

  async simulateRecipeCost(
    ingredients: { ingredientId: number; quantity: number }[],
    operationalCost: number = 0,
    servings: number = 1,
  ) {
    let totalCost = 0;

    const ingredientCosts = await Promise.all(
      ingredients.map(async (item) => {
        const ingredient = await this.prisma.ingredient.findUnique({
          where: { id: item.ingredientId },
        });

        if (!ingredient) {
          throw new Error(`Ingrediente ${item.ingredientId} não encontrado`);
        }

        const cost = item.quantity * ingredient.unitCost;
        totalCost += cost;

        return {
          ingredientId: item.ingredientId,
          name: ingredient.name,
          quantity: item.quantity,
          unitCost: ingredient.unitCost,
          totalCost: cost,
        };
      }),
    );

    const finalCost = totalCost + operationalCost;

    return {
      ingredients: ingredientCosts,
      totalIngredientsCost: totalCost,
      operationalCost,
      finalCost,
      costPerServing: finalCost / servings,
    };
  }

  async getMarginAnalysis(userId: number) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        userId,
        isActive: true,
        sellingPrice: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        finalCost: true,
        sellingPrice: true,
        profitMargin: true,
        netProfit: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    const analysis = {
      totalRecipes: recipes.length,
      averageMargin: recipes.reduce((sum, r) => sum + r.profitMargin, 0) / recipes.length || 0,
      totalRevenue: recipes.reduce((sum, r) => sum + r.sellingPrice, 0),
      totalCost: recipes.reduce((sum, r) => sum + r.finalCost, 0),
      totalProfit: recipes.reduce((sum, r) => sum + r.netProfit, 0),
      bestMargin: Math.max(...recipes.map(r => r.profitMargin), 0),
      worstMargin: Math.min(...recipes.map(r => r.profitMargin), 0),
      profitableRecipes: recipes.filter(r => r.netProfit > 0).length,
    };

    return {
      analysis,
      recipes: recipes.sort((a, b) => b.profitMargin - a.profitMargin),
    };
  }
}