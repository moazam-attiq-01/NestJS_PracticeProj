import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'
import { ConfigService } from '@nestjs/config'
import { PostgresExceptionFilter } from './utils/postgres-exception.filter'
import { AllExceptionsFilter } from './utils/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  app.enableCors({
    origin: true,
    credentials: true,
  })
  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      resave: true,
      rolling: true,
      saveUninitialized: false, 
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        sameSite: 'lax',
      },
    }),
  )
  app.useGlobalFilters(new PostgresExceptionFilter())
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
