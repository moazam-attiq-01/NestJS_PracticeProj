declare class DiscountDto {
    amount: number;
    available: boolean;
}
export declare class ItemDto {
    id: number;
    available: boolean;
    category_id: number;
    name: string;
    price: number;
    description: string;
    discount?: DiscountDto;
}
declare class DealItemDto {
    item_id: number;
    qty: number;
}
export declare class DealDto {
    id: number;
    name: string;
    img: string;
    price: number;
    items: DealItemDto[];
    available: boolean;
}
export {};
