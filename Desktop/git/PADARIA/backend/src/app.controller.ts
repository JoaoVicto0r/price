import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Status') // Adiciona tag para Swagger (opcional)
export class AppController {
  
  @Get()
  @ApiOperation({ summary: 'Verifica status da API' })
  @ApiResponse({ status: 200, description: 'API online' })
  getStatus() {
    return { 
      status: 'API is up and running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  healthCheck() {
    return {
      status: 'healthy',
      services: {
        database: 'connected', // Você pode adicionar verificação real do DB
        cache: 'active'       // E outros serviços que deseja monitorar
      },
      uptime: process.uptime()
    };
  }
}