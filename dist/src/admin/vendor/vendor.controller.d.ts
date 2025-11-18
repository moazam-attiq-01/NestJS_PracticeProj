import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dto';
export declare class VendorController {
    private readonly vendorService;
    constructor(vendorService: VendorService);
    createVendor(dto: CreateVendorDto): Promise<any>;
    updateVendor(vendorId: number, dto: UpdateVendorDto): Promise<{
        message: string;
    }>;
    deleteVendor(vendorId: number): Promise<{
        message: string;
    }>;
}
