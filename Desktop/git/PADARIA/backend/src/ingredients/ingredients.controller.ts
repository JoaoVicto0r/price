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
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredients.dto';
import { UpdateIngredientDto } from './dto/update-ingredients.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto, @Request() req) {
    return this.ingredientsService.create(createIngredientDto, req.user.userId);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('categoryId') categoryId?: string,
    @Query('lowStock') lowStock?: boolean,
  ) {
    const categoryIdNumber = categoryId ? Number(categoryId) : undefined;
    return this.ingredientsService.findAll(req.user.userId, categoryIdNumber, lowStock);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.ingredientsService.getIngredientStats(req.user.userId);
  }

  @Get('alerts')
  getAlerts(@Request() req) {
    return this.ingredientsService.getStockAlert(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ingredientsService.findOne(Number(id), req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @Request() req,
  ) {
    return this.ingredientsService.update(Number(id), updateIngredientDto, req.user.userId);
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() stockData: { quantity: number; operation: 'add' | 'subtract' },
    @Request() req,
  ) {
    return this.ingredientsService.updateStock(
      Number(id),
      stockData.quantity,
      req.user.userId,
      stockData.operation,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ingredientsService.remove(Number(id), req.user.userId);
  }
}