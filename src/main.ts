import { DrizzleStore } from './session/drizzle-session.store'
import { DB_CONNECTION } from './db/db.module'
import { Inject } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import session from 'express-session'
import { PostgresExceptionFilter } from './utils/postgres-exception.filter'
import { AllExceptionsFilter } from './utils/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  
  const db = app.get(DB_CONNECTION) // get your Drizzle DB instance

  app.enableCors({ origin: true, credentials: true })

  app.use(
    session({
      store: new DrizzleStore(db),
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' },
    }),
  )

  app.useGlobalFilters(new PostgresExceptionFilter())
  app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(process.env.PORT ?? 3000)
}
