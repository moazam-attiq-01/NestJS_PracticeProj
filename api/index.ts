// api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import session from 'express-session';

// Import from compiled dist
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PostgresExceptionFilter } from './utils/postgres-exception.filter';
import { AllExceptionsFilter } from './utils/http-exception.filter';

const expressApp = express();
let cachedApp: any;

async function createNestServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    const config = app.get(ConfigService);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.use(
      session({
        secret: config.getOrThrow<string>('SESSION_SECRET'),
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          sameSite: 'lax',
        },
      }),
    );

    app.useGlobalFilters(new PostgresExceptionFilter());
    app.useGlobalFilters(new AllExceptionsFilter());

    expressApp.use(express.json({ limit: '10mb' }));
    expressApp.use(express.urlencoded({ extended: true }));

    await app.init();
    cachedApp = app;
  }

  return cachedApp;
}

export default async function handler(req, res) {
  await createNestServer();
  return expressApp(req, res);
}
