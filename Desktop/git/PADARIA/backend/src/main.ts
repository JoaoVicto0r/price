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
  app.use(cookieParser(configService.get('COOKIE_SECRET'), {
  httpOnly: true,
  secure: configService.get('NODE_ENV') === 'production',
  sameSite: 'lax', // Mude para 'strict' se não precisar de cross-origin
  domain: configService.get('COOKIE_DOMAIN') || 'localhost'
}));
  app.use(compression());

  // Middleware de log para depuração
  app.use((req, res, next) => {
  logger.debug(`Request: ${req.method} ${req.url}`);
  logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
  logger.debug(`Cookies: ${JSON.stringify(req.cookies)}`);
  next();
});


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
      'X-CSRF-Token',
      'Set-Cookie'
    ],
    exposedHeaders: [
      'Authorization', 
      'Set-Cookie', 
      'X-Total-Count',
      'X-Refresh-Token'
    ],
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
      .addCookieAuth('auth_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'auth_token',
        description: 'Token de autenticação via cookie'
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        withCredentials: true, // Permite enviar cookies
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    });
  }

  // ===== Configuração Global =====
 // app.setGlobalPrefix('api/v1');

  // ===== Verificação de Variáveis =====
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'COOKIE_SECRET'];
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
  logger.log(`🍪 Cookie auth habilitado`);
  logger.log(`🛡️  CORS habilitado para: ${allowedOrigins.join(', ')}`);
}

bootstrap().catch((err) => {
  console.error('Falha crítica na inicialização:', err);
  process.exit(1);
});