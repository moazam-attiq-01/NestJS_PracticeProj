import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { PostgresExceptionFilter } from '../src/utils/postgres-exception.filter';
import { AllExceptionsFilter } from '../src/utils/http-exception.filter';

const expressApp = express();

let cachedApp;

async function createNestApp() {
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
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      }),
    );
    
    app.useGlobalFilters(new PostgresExceptionFilter());
    app.useGlobalFilters(new AllExceptionsFilter());
    
    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

export default async (req, res) => {
  await createNestApp();
  return expressApp(req, res);
};