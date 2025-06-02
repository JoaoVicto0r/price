import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalculatorService } from '../calculator/calculator.service';

@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly calculatorService: CalculatorService,
  ) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
    return this.recipesService.create(createRecipeDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('categoryId') categoryId?: string) {
    const categoryIdNumber = categoryId ? Number(categoryId) : undefined;
    return this.recipesService.findAll(req.user.userId, categoryIdNumber);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.recipesService.getRecipeStats(req.user.userId);
  }

  @Get('margin-analysis')
  getMarginAnalysis(@Request() req) {
    return this.calculatorService.getMarginAnalysis(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.recipesService.findOne(Number(id), req.user.userId);
  }

  @Get(':id/calculate')
  calculateCosts(@Param('id') id: string, @Request() req) {
    return this.calculatorService.calculateRecipeCosts(Number(id));
  }

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req,
  ) {
    return this.recipesService.update(Number(id), updateRecipeDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.recipesService.remove(Number(id), req.user.userId);
  }
}