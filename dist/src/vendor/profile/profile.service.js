"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const db_module_1 = require("../../db/db.module");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
let ProfileService = class ProfileService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getCategories(vendorId) {
        const categories = await this.db.select().from(schema.category);
        const vendorCategories = await this.db
            .select({
            id: schema.category.id,
            name: schema.category.name,
            img: schema.category.img,
        })
            .from(schema.category)
            .innerJoin(schema.vendorCategory, (0, drizzle_orm_1.eq)(schema.vendorCategory.category_id, schema.category.id))
            .where((0, drizzle_orm_1.eq)(schema.vendorCategory.vendor_id, vendorId));
        return { allCategories: categories, vendorCategories: vendorCategories };
    }
    async addCategory(vendorId, category, file) {
        const imagePath = file ? `uploads/categories/${file.filename}` : null;
        const newCategory = await this.db
            .insert(schema.category)
            .values({ name: category.name, img: imagePath })
            .returning();
        await this.db.insert(schema.vendorCategory).values({ vendor_id: vendorId, category_id: newCategory[0].id });
        return newCategory[0];
    }
    async updateCategory(vendorId, categories) {
        for (const category of categories) {
            await this.db
                .insert(schema.vendorCategory)
                .values({ vendor_id: vendorId, category_id: category })
                .onConflictDoNothing();
        }
        const vendorCategories = await this.db
            .select({
            id: schema.category.id,
            name: schema.category.name,
            img: schema.category.img,
        })
            .from(schema.category)
            .innerJoin(schema.vendorCategory, (0, drizzle_orm_1.eq)(schema.vendorCategory.category_id, schema.category.id))
            .where((0, drizzle_orm_1.eq)(schema.vendorCategory.vendor_id, vendorId));
        return { categories: vendorCategories };
    }
    async updateProfile(vendorId, details) {
        const updateData = { ...details };
        if (details.password) {
            updateData.password = await bcrypt_1.default.hash(details.password, 10);
        }
        await this.db.update(schema.vendor).set(updateData).where((0, drizzle_orm_1.eq)(schema.vendor.id, vendorId));
        return { message: 'Profile updated successfully' };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], ProfileService);
//# sourceMappingURL=profile.service.js.map