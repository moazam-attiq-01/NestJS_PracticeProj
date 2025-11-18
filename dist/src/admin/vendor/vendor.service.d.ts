import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { CreateVendorDto, UpdateVendorDto } from './dto';
export declare class VendorService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    createVendor(data: CreateVendorDto): Promise<any>;
    updateVendor(vendorId: number, data: UpdateVendorDto): Promise<{
        message: string;
    }>;
    deleteVendor(vendorId: number): Promise<{
        message: string;
    }>;
}
