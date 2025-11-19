import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { PostgresExceptionFilter } from '../dist/src/utils/postgres-exception.filter';
import { AllExceptionsFilter } from '../dist/src/utils/http-exception.filter';

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

    // Enable raw body parsing for uploads if needed
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
