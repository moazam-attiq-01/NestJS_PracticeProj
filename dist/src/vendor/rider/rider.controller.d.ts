import { RiderService } from './rider.service';
import { RiderDto } from './dto';
export declare class RiderController {
    private readonly ridersService;
    constructor(ridersService: RiderService);
    create(vendorId: number, data: RiderDto): {
        data: any;
    };
    getAll(vendorId: number): {
        data: any;
    };
    update(vendorId: number, data: RiderDto): {
        data: Promise<any>;
    };
    delete(vendorId: number, id: string): {
        data: Promise<{
            message: string;
        }>;
    };
}
