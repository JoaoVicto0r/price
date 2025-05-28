import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}