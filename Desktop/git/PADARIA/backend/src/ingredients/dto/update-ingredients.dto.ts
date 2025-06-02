import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredients.dto';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}