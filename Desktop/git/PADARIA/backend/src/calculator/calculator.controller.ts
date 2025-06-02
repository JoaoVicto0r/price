import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('calculator')
@UseGuards(JwtAuthGuard)
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('simulate')
  simulateCosts(@Body() simulationData: {
    ingredients: { ingredientId: number; quantity: number }[];
    operationalCost?: number;
    servings?: number;
  }) {
    return this.calculatorService.simulateRecipeCost(
      simulationData.ingredients,
      simulationData.operationalCost,
      simulationData.servings,
    );
  }

  @Get('ingredient/:id/usage')
  getIngredientUsage(@Param('id') id: number, @Request() req) {
    return this.calculatorService.calculateIngredientUsage(Number(id), req.user.userId);
  }

  @Get('margin-analysis')
  getMarginAnalysis(@Request() req) {
    return this.calculatorService.getMarginAnalysis(req.user.userId);
  }

  @Post('recipe/:id/calculate')
  calculateRecipeCosts(@Param('id') id: string) {
    return this.calculatorService.calculateRecipeCosts(Number(id));
  }
}