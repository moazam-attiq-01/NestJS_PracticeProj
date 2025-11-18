"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
const dto_1 = require("./dto");
const auth_guard_1 = require("../auth/auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const upload_interceptor_1 = require("../../utils/upload.interceptor");
let MenuController = class MenuController {
    menuService;
    constructor(menuService) {
        this.menuService = menuService;
    }
    async createItem(file, vendorId, data) {
        if (typeof data.available === 'string') {
            data.available = data.available === 'true';
        }
        if (typeof data.discount === 'string') {
            try {
                data.discount = JSON.parse(data.discount);
            }
            catch {
                data.discount = eval('(' + data.discount + ')');
            }
        }
        const item = await this.menuService.createItem(data, file, vendorId);
        return { item };
    }
    async updateItem(vendorId, itemId, data) {
        const response = await this.menuService.updateItem(data, vendorId, itemId);
        return { data: response };
    }
    async getItems(vendorId) {
        const items = await this.menuService.getItems(vendorId);
        return { items };
    }
    async deleteItem(vendorId, itemId) {
        const result = await this.menuService.deleteItem(vendorId, itemId);
        return { data: result };
    }
    async createDeal(file, vendorId, data) {
        if (typeof data.available === 'string') {
            data.available = data.available === 'true';
        }
        if (typeof data.price === 'string') {
            data.price = Number(data.price);
        }
        const deal = await this.menuService.createDeal(data, file, vendorId);
        return { data: deal };
    }
    async getDeals(vendorId) {
        const deals = await this.menuService.getDeals(vendorId);
        console.log(deals);
        return { data: deals };
    }
    updateDeal(vendorId, data) {
        const result = this.menuService.updateDeal(data, vendorId);
        return { data: result };
    }
    async deleteDeal(vendorId, dealId) {
        const result = await this.menuService.deleteDeal(vendorId, dealId);
        return { data: result };
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.UseInterceptors)((0, upload_interceptor_1.UploadInterceptor)('image', 'items')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, auth_decorator_1.Vendor)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, Number, dto_1.ItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createItem", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.ItemDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Get)('items'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getItems", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteItem", null);
__decorate([
    (0, common_1.Post)('deals'),
    (0, common_1.UseInterceptors)((0, upload_interceptor_1.UploadInterceptor)('image', 'deals')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, auth_decorator_1.Vendor)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof Express !== "undefined" && (_c = Express.Multer) !== void 0 && _c.File) === "function" ? _d : Object, Number, dto_1.DealDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createDeal", null);
__decorate([
    (0, common_1.Get)('deals'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getDeals", null);
__decorate([
    (0, common_1.Put)('deals'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.DealDto]),
    __metadata("design:returntype", void 0)
], MenuController.prototype, "updateDeal", null);
__decorate([
    (0, common_1.Delete)('deals/:id'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteDeal", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('vendor/menu'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map