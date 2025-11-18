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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderController = void 0;
const common_1 = require("@nestjs/common");
const rider_service_1 = require("./rider.service");
const auth_guard_1 = require("../auth/auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const dto_1 = require("./dto");
let RiderController = class RiderController {
    ridersService;
    constructor(ridersService) {
        this.ridersService = ridersService;
    }
    create(vendorId, data) {
        return { data: this.ridersService.createRider(data, vendorId) };
    }
    getAll(vendorId) {
        return { data: this.ridersService.getRiders(vendorId) };
    }
    update(vendorId, data) {
        if (!data.id)
            throw new common_1.BadRequestException('id is required');
        return { data: this.ridersService.updateRider(data, vendorId) };
    }
    delete(vendorId, id) {
        if (!id)
            throw new common_1.BadRequestException('id is required');
        return { data: this.ridersService.deleteRider(vendorId, Number(id)) };
    }
};
exports.RiderController = RiderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.RiderDto]),
    __metadata("design:returntype", void 0)
], RiderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RiderController.prototype, "getAll", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.RiderDto]),
    __metadata("design:returntype", void 0)
], RiderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], RiderController.prototype, "delete", null);
exports.RiderController = RiderController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('vendor/riders'),
    __metadata("design:paramtypes", [rider_service_1.RiderService])
], RiderController);
//# sourceMappingURL=rider.controller.js.map