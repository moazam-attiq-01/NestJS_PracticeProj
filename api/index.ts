import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
const express = require('express')

const server = express();
let isInitialized = false;

async function bootstrap() {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();
    isInitialized = true;
  }
}

export default async (req, res) => {
  await bootstrap();
  return server(req, res);
};
