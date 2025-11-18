import { ProfileService } from './profile.service';
import { CategoryDto } from './dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getCategories(id: number): Promise<{
        allCategories: any;
        vendorCategories: any;
    }>;
    addCategory(id: number, file: Express.Multer.File, data: CategoryDto): Promise<any>;
    updateCategory(id: number, data: number[]): Promise<{
        categories: any;
    }>;
}
