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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const auth_guard_1 = require("../auth/auth.guard");
const auth_decorator_1 = require("../auth/auth.decorator");
const dto_1 = require("./dto");
const upload_interceptor_1 = require("../../utils/upload.interceptor");
let ProfileController = class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getCategories(id) {
        return this.profileService.getCategories(id);
    }
    addCategory(id, file, data) {
        return this.profileService.addCategory(id, data, file);
    }
    updateCategory(id, data) {
        if (!data.length || data.length === 0) {
            throw new common_1.BadRequestException('invalid or missing data');
        }
        return this.profileService.updateCategory(id, data);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('category'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('category'),
    (0, common_1.UseInterceptors)((0, upload_interceptor_1.UploadInterceptor)('image', 'categories')),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, dto_1.CategoryDto]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Put)('category'),
    __param(0, (0, auth_decorator_1.Vendor)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updateCategory", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('vendor/profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map