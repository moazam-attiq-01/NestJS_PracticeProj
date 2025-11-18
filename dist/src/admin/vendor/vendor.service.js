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
exports.VendorService = void 0;
const common_1 = require("@nestjs/common");
const db_module_1 = require("../../db/db.module");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
let VendorService = class VendorService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createVendor(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
        const [vendor] = await this.db
            .insert(schema.vendor)
            .values({
            username: data.username,
            email: data.email,
            password: hashedPassword,
            img: data.img,
            location: data.location,
            locked: data.locked ?? false,
            phone: data.phone,
        })
            .returning();
        return vendor;
    }
    async updateVendor(vendorId, data) {
        const [existing] = await this.db.select().from(schema.vendor).where((0, drizzle_orm_1.eq)(schema.vendor.id, vendorId));
        if (!existing)
            throw new common_1.BadRequestException('Vendor not found');
        await this.db
            .update(schema.vendor)
            .set({
            username: data.username ?? existing.username,
            email: data.email ?? existing.email,
            img: data.img ?? existing.img,
            location: data.location ?? existing.location,
            locked: data.locked ?? existing.locked,
            phone: data.phone ?? existing.phone,
        })
            .where((0, drizzle_orm_1.eq)(schema.vendor.id, vendorId));
        return { message: 'Vendor updated successfully' };
    }
    async deleteVendor(vendorId) {
        await this.db.delete(schema.vendor).where((0, drizzle_orm_1.eq)(schema.vendor.id, vendorId));
        return { message: 'Vendor deleted successfully' };
    }
};
exports.VendorService = VendorService;
exports.VendorService = VendorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], VendorService);
//# sourceMappingURL=vendor.service.js.map