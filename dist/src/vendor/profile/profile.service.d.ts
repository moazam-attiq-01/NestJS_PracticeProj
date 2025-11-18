import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { CategoryDto, UpdateProfileDto } from './dto';
export declare class ProfileService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    getCategories(vendorId: number): Promise<{
        allCategories: any;
        vendorCategories: any;
    }>;
    addCategory(vendorId: number, category: CategoryDto, file: Express.Multer.File): Promise<any>;
    updateCategory(vendorId: number, categories: number[]): Promise<{
        categories: any;
    }>;
    updateProfile(vendorId: number, details: UpdateProfileDto): Promise<{
        message: string;
    }>;
}
