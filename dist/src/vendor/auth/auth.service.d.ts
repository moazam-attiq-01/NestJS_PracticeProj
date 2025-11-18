import { LoginDto } from './dto';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
export declare class AuthService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    login(data: LoginDto): Promise<{
        email: any;
        username: any;
        id: any;
    }>;
}
