import { DealDto, ItemDto } from './dto';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
export declare class MenuService {
    private db;
    constructor(db: PostgresJsDatabase<typeof schema>);
    createItem(data: ItemDto, file: Express.Multer.File, vendorId: number): Promise<{
        id: any;
        name: any;
        description: any;
        price: any;
        available: any;
        category: any;
        discount: {
            amount: any;
            available: any;
        };
        img: any;
    }>;
    getItems(vendorId: number): Promise<any>;
    updateItem(data: ItemDto, vendorId: number, itemId: number): Promise<{
        message: string;
    }>;
    deleteItem(vendorId: number, itemId: number): Promise<{
        message: string;
        itemId: number;
    }>;
    createDeal(data: DealDto, file: Express.Multer.File, vendorId: number): Promise<{
        deal_id: any;
        deal_name: any;
        deal_price: any;
        deal_img: any;
        deal_available: any;
        created_at: any;
        items: any;
    } | null>;
    getDeals(vendorId: number): Promise<any[]>;
    updateDeal(data: DealDto, vendorId: number): Promise<{
        message: string;
    }>;
    deleteDeal(vendorId: number, dealId: number): Promise<{
        message: string;
        dealId: number;
    }>;
}
