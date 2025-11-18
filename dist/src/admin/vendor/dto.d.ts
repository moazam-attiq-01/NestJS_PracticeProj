export declare class CreateVendorDto {
    username: string;
    email: string;
    password: string;
    img?: string;
    location?: string;
    locked?: boolean;
    phone: string;
}
export declare class UpdateVendorDto {
    username?: string;
    email?: string;
    img?: string;
    location?: string;
    locked?: boolean;
    phone: string;
    category_ids?: number[];
}
