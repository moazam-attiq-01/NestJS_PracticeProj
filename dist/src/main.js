"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_session_1 = __importDefault(require("express-session"));
const config_1 = require("@nestjs/config");
const postgres_exception_filter_1 = require("./utils/postgres-exception.filter");
const http_exception_filter_1 = require("./utils/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use((0, express_session_1.default)({
        secret: config.getOrThrow('SESSION_SECRET'),
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            sameSite: 'lax',
        },
    }));
    app.useGlobalFilters(new postgres_exception_filter_1.PostgresExceptionFilter());
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map