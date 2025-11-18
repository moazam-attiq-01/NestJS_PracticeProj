"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let PostgresExceptionFilter = class PostgresExceptionFilter {
    catch(exception) {
        const error = exception instanceof Error ? exception : new Error(String(exception));
        if (error.message.includes('duplicate key')) {
            throw new common_1.BadRequestException('A record with these values already exists.');
        }
        if (error.message.includes('violates not-null constraint')) {
            throw new common_1.BadRequestException('A required field was missing.');
        }
        throw error;
    }
};
exports.PostgresExceptionFilter = PostgresExceptionFilter;
exports.PostgresExceptionFilter = PostgresExceptionFilter = __decorate([
    (0, common_1.Catch)(Error)
], PostgresExceptionFilter);
//# sourceMappingURL=postgres-exception.filter.js.map