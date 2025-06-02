import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });
  
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);

  // ===== Configurações de Segurança =====
  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());

  // ===== Configuração de CORS =====
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.56.1:3000',
    'https://price-lyart-kappa.vercel.app',
    'https://price-d26o.onrender.com'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Requisição CORS bloqueada: ${origin}`);
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-CSRF-Token'
    ],
    exposedHeaders: ['Authorization', 'Set-Cookie', 'X-Total-Count'],
  });

  // ===== Validação Global =====
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }),
  );

  // ===== Filtro Global de Exceções =====
  app.useGlobalFilters(new HttpExceptionFilter());

  // ===== Configuração do Swagger =====
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Padaria')
      .setDescription('Sistema de gerenciamento de padaria')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('auth_token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    });
  }

  // ===== Configuração Global =====
  app.setGlobalPrefix('api/v1');

  // ===== Verificação de Variáveis =====
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  requiredEnvVars.forEach((envVar) => {
    if (!configService.get(envVar)) {
      logger.error(`Variável de ambiente ${envVar} não configurada`);
      process.exit(1);
    }
  });

  // ===== Inicialização do Servidor =====
  const port = configService.get('PORT') || 3333;
  await app.listen(port, '0.0.0.0');

  // ===== Logs de Inicialização =====
  logger.log(`🛠  Ambiente: ${configService.get('NODE_ENV') || 'development'}`);
  logger.log(`🚀 API rodando em: http://localhost:${port}`);
  logger.log(`📚 Swagger disponível em: http://localhost:${port}/api-docs`);
  logger.log(`🛡️  CORS habilitado para: ${allowedOrigins.join(', ')}`);
}

bootstrap().catch((err) => {
  console.error('Falha crítica na inicialização:', err);
  process.exit(1);
});