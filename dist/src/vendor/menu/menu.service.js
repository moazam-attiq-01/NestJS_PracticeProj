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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const db_module_1 = require("../../db/db.module");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let MenuService = class MenuService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createItem(data, file, vendorId) {
        const imagePath = `uploads/items/${file.filename}`;
        const [item] = await this.db
            .insert(schema.item)
            .values({
            name: data.name,
            price: Number(data.price),
            description: data.description,
            available: Boolean(data.available) ?? false,
            category_id: Number(data.category_id),
            vendor_id: vendorId,
            img: imagePath,
        })
            .returning();
        if (data.discount && data.discount.amount > 0) {
            await this.db.insert(schema.itemDiscount).values({
                item_id: item.id,
                amount: data.discount.amount,
                available: Boolean(data.discount.available),
            });
        }
        const [fullItem] = await this.db
            .select({
            id: schema.item.id,
            name: schema.item.name,
            description: schema.item.description,
            price: schema.item.price,
            available: schema.item.available,
            category: schema.category.name,
            discount_amount: schema.itemDiscount.amount,
            discount_available: schema.itemDiscount.available,
            img: schema.item.img,
        })
            .from(schema.item)
            .leftJoin(schema.category, (0, drizzle_orm_1.eq)(schema.item.category_id, schema.category.id))
            .leftJoin(schema.itemDiscount, (0, drizzle_orm_1.eq)(schema.item.id, schema.itemDiscount.item_id))
            .where((0, drizzle_orm_1.eq)(schema.item.id, item.id));
        return {
            id: fullItem.id,
            name: fullItem.name,
            description: fullItem.description ?? '',
            price: fullItem.price,
            available: fullItem.available ?? false,
            category: fullItem.category ?? '',
            discount: {
                amount: fullItem.discount_amount ?? 0,
                available: fullItem.discount_available ?? false,
            },
            img: fullItem.img ?? '',
        };
    }
    async getItems(vendorId) {
        const items = await this.db
            .select({
            id: schema.item.id,
            name: schema.item.name,
            description: schema.item.description,
            price: schema.item.price,
            available: schema.item.available,
            category: schema.category.name,
            categoryId: schema.category.id,
            discount_amount: schema.itemDiscount.amount,
            discount_available: schema.itemDiscount.available,
            img: schema.item.img,
        })
            .from(schema.item)
            .leftJoin(schema.category, (0, drizzle_orm_1.eq)(schema.item.category_id, schema.category.id))
            .leftJoin(schema.itemDiscount, (0, drizzle_orm_1.eq)(schema.item.id, schema.itemDiscount.item_id))
            .where((0, drizzle_orm_1.eq)(schema.item.vendor_id, vendorId));
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            available: item.available ?? false,
            price: item.price,
            description: item.description ?? '',
            category: item.category ?? '',
            categoryId: item.categoryId,
            discount: {
                amount: item.discount_amount ?? 0,
                available: item.discount_available ?? false,
            },
            img: item.img ?? '',
        }));
    }
    async updateItem(data, vendorId, itemId) {
        if (!data)
            throw new common_1.BadRequestException('No data provided for update');
        const [item] = await this.db
            .select()
            .from(schema.item)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.item.id, itemId), (0, drizzle_orm_1.eq)(schema.item.vendor_id, vendorId)));
        if (!item)
            throw new common_1.BadRequestException('Item not found or not owned by vendor');
        await this.db
            .update(schema.item)
            .set({
            name: data.name ?? item.name,
            price: data.price ?? item.price,
            description: data.description ?? item.description,
            category_id: data.category_id ?? item.category_id,
            available: data.available ?? item.available,
        })
            .where((0, drizzle_orm_1.eq)(schema.item.id, itemId));
        if (data.discount) {
            await this.db
                .insert(schema.itemDiscount)
                .values({
                item_id: itemId,
                amount: data.discount.amount,
                available: data.discount.available,
            })
                .onConflictDoUpdate({
                target: schema.itemDiscount.item_id,
                set: {
                    amount: data.discount.amount,
                    available: data.discount.available,
                },
            });
        }
        return { message: 'Item updated successfully' };
    }
    async deleteItem(vendorId, itemId) {
        const deleted = await this.db
            .delete(schema.item)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.item.vendor_id, vendorId), (0, drizzle_orm_1.eq)(schema.item.id, itemId)));
        if (!deleted) {
            throw new common_1.BadRequestException('Item not found or not owned by vendor');
        }
        return { message: 'Item deleted successfully', itemId };
    }
    async createDeal(data, file, vendorId) {
        const items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
        const imagePath = '';
        const [deal] = await this.db
            .insert(schema.deal)
            .values({ name: data.name, img: imagePath, price: data.price, vendor_id: vendorId, available: data.available })
            .returning();
        for (const i of items) {
            await this.db.insert(schema.dealItem).values({ deal_id: deal.id, item_id: i.item_id, quantity: i.qty });
        }
        const rows = await this.db
            .select({
            deal_id: schema.deal.id,
            deal_name: schema.deal.name,
            deal_price: schema.deal.price,
            deal_img: schema.deal.img,
            deal_available: schema.deal.available,
            created_at: schema.deal.created_at,
            item_id: schema.item.id,
            item_name: schema.item.name,
            item_quantity: schema.dealItem.quantity,
            item_category: schema.category.name,
        })
            .from(schema.deal)
            .leftJoin(schema.dealItem, (0, drizzle_orm_1.eq)(schema.deal.id, schema.dealItem.deal_id))
            .leftJoin(schema.item, (0, drizzle_orm_1.eq)(schema.dealItem.item_id, schema.item.id))
            .leftJoin(schema.category, (0, drizzle_orm_1.eq)(schema.item.category_id, schema.category.id))
            .where((0, drizzle_orm_1.eq)(schema.deal.id, deal.id));
        const fullDeal = rows.length
            ? {
                deal_id: rows[0].deal_id,
                deal_name: rows[0].deal_name,
                deal_price: rows[0].deal_price,
                deal_img: rows[0].deal_img ?? '',
                deal_available: rows[0].deal_available ?? false,
                created_at: rows[0].created_at,
                items: rows.map((row) => ({
                    itemId: row.item_id,
                    itemName: row.item_name,
                    itemQuantity: row.item_quantity,
                    itemCategory: row.item_category,
                })),
            }
            : null;
        return fullDeal;
    }
    async getDeals(vendorId) {
        const rows = await this.db
            .select({
            deal_id: schema.deal.id,
            deal_name: schema.deal.name,
            deal_available: schema.deal.available,
            deal_price: schema.deal.price,
            deal_img: schema.deal.img,
            item_id: schema.item.id,
            item_name: schema.item.name,
            item_quantity: schema.dealItem.quantity,
            item_category: schema.category.name,
        })
            .from(schema.deal)
            .leftJoin(schema.dealItem, (0, drizzle_orm_1.eq)(schema.deal.id, schema.dealItem.deal_id))
            .leftJoin(schema.item, (0, drizzle_orm_1.eq)(schema.dealItem.item_id, schema.item.id))
            .leftJoin(schema.category, (0, drizzle_orm_1.eq)(schema.item.category_id, schema.category.id))
            .where((0, drizzle_orm_1.eq)(schema.deal.vendor_id, vendorId));
        const grouped = {};
        for (const row of rows) {
            if (!grouped[row.deal_id]) {
                grouped[row.deal_id] = {
                    dealId: row.deal_id,
                    dealImg: row.deal_img,
                    dealName: row.deal_name,
                    available: row.deal_available,
                    price: row.deal_price,
                    items: [],
                };
            }
            if (row.item_id) {
                grouped[row.deal_id].items.push({
                    itemId: row.item_id,
                    name: row.item_name,
                    quantity: row.item_quantity,
                    category: row.item_category,
                });
            }
        }
        return Object.values(grouped);
    }
    async updateDeal(data, vendorId) {
        const [existing] = await this.db
            .select()
            .from(schema.deal)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.deal.id, data.id), (0, drizzle_orm_1.eq)(schema.deal.vendor_id, vendorId)));
        if (!existing)
            throw new common_1.BadRequestException('Deal not found or not owned by vendor');
        await this.db
            .update(schema.deal)
            .set({ name: data.name, img: data.img, price: data.price, available: data.available })
            .where((0, drizzle_orm_1.eq)(schema.deal.id, data.id));
        await this.db.delete(schema.dealItem).where((0, drizzle_orm_1.eq)(schema.dealItem.deal_id, data.id));
        for (const i of data.items) {
            await this.db.insert(schema.dealItem).values({ deal_id: data.id, item_id: i.item_id, quantity: i.qty });
        }
        return { message: 'Deal updated successfully' };
    }
    async deleteDeal(vendorId, dealId) {
        const deleted = await this.db
            .delete(schema.deal)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.deal.vendor_id, vendorId), (0, drizzle_orm_1.eq)(schema.deal.id, dealId)));
        if (!deleted) {
            throw new common_1.BadRequestException('Deal not found or not owned by vendor');
        }
        return { message: 'Deal deleted successfully', dealId };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(db_module_1.DB_CONNECTION)),
    __metadata("design:paramtypes", [Object])
], MenuService);
//# sourceMappingURL=menu.service.js.map