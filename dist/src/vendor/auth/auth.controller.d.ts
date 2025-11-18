import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
export declare class AuthController {
    private db;
    private readonly authService;
    constructor(db: PostgresJsDatabase<typeof schema>, authService: AuthService);
    login(req: Request, data: LoginDto): Promise<{
        vendor: any;
    }>;
    me(req: Request): Promise<{
        vendor: any;
    } | null>;
    logout(req: Request): Promise<{
        message: string;
    }>;
}
