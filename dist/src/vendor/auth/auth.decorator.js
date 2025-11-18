"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const common_1 = require("@nestjs/common");
exports.Vendor = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const vendor = req.session.vendor;
    if (!vendor) {
        return null;
    }
    return data ? vendor[data] : vendor;
});
//# sourceMappingURL=auth.decorator.js.map