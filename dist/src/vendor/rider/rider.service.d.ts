import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { RiderDto } from './dto';
export declare class RiderService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    createRider(data: RiderDto, vendorId: number): any;
    getRiders(vendorId: number): any;
    updateRider(data: RiderDto, vendorId: number): Promise<any>;
    deleteRider(vendorId: number, riderId: number): Promise<{
        message: string;
    }>;
}
