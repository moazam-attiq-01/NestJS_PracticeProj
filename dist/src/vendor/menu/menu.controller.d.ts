import { MenuService } from './menu.service';
import { DealDto, ItemDto } from './dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    createItem(file: Express.Multer.File, vendorId: number, data: ItemDto): Promise<{
        item: {
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
        };
    }>;
    updateItem(vendorId: number, itemId: number, data: ItemDto): Promise<{
        data: {
            message: string;
        };
    }>;
    getItems(vendorId: number): Promise<{
        items: any;
    }>;
    deleteItem(vendorId: number, itemId: number): Promise<{
        data: {
            message: string;
            itemId: number;
        };
    }>;
    createDeal(file: Express.Multer.File, vendorId: number, data: DealDto): Promise<{
        data: {
            deal_id: any;
            deal_name: any;
            deal_price: any;
            deal_img: any;
            deal_available: any;
            created_at: any;
            items: any;
        } | null;
    }>;
    getDeals(vendorId: number): Promise<{
        data: any[];
    }>;
    updateDeal(vendorId: number, data: DealDto): {
        data: Promise<{
            message: string;
        }>;
    };
    deleteDeal(vendorId: number, dealId: number): Promise<{
        data: {
            message: string;
            dealId: number;
        };
    }>;
}
