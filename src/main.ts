import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
import { ConfigService } from "@nestjs/config";
import { PostgresExceptionFilter } from "./utils/postgres-exception.filter";
import { AllExceptionsFilter } from "./utils/http-exception.filter";
import { DbSessionStore } from "./vendor/auth/session.store";
import { DB_CONNECTION } from "./db/db.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: ["http://localhost:5173", "https://areena-eats-c9muhuikh-moazam-attiq-01s-projects.vercel.app/"],
    credentials: true,
  });

  const db = app.get(DB_CONNECTION);
  app.use(
    session({
      secret: config.getOrThrow<string>("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: "none",
      },
      store: new DbSessionStore(db),
    })
  );
  app.useGlobalFilters(new PostgresExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
