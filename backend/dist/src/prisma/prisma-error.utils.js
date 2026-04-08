"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaErrorHandler = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaErrorHandler = class PrismaErrorHandler {
    handleError(error, options = {}, defaultMessage) {
        const { entity = "record", uniqueFieldMap = {}, foreignKeyMap = {}, customMessages = {}, } = options;
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            const message = this.getPrismaErrorMessage(error, entity, uniqueFieldMap, foreignKeyMap, customMessages);
            throw this.createException(error.code, message);
        }
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            throw new common_1.BadRequestException(`Invalid data provided for ${entity} operation`);
        }
        if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
            console.error("Unknown Prisma error:", error);
            throw new common_1.InternalServerErrorException(`An unexpected database error occurred while processing ${entity}`);
        }
        if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
            console.error("Prisma initialisation error:", error);
            throw new common_1.InternalServerErrorException("Database connection failed");
        }
        if (error instanceof client_1.Prisma.PrismaClientRustPanicError) {
            console.error("Prisma Rust panic:", error);
            throw new common_1.InternalServerErrorException("Database system error");
        }
        if (error?.status && error?.response) {
            throw error;
        }
        console.error(`Unexpected error in ${entity} operation:`, error);
        throw new common_1.InternalServerErrorException(defaultMessage || `Failed to process ${entity}`);
    }
    getPrismaErrorMessage(error, entity, uniqueFieldMap, foreignKeyMap, customMessages) {
        if (customMessages[error.code]) {
            return customMessages[error.code];
        }
        switch (error.code) {
            case "P2002":
                return this.getUniqueConstraintMessage(error, entity, uniqueFieldMap);
            case "P2025":
                return `${this.capitalize(entity)} not found`;
            case "P2003":
                return this.getForeignKeyMessage(error, entity, foreignKeyMap);
            case "P2014":
                return `Invalid ${entity} ID provided`;
            case "P2016":
                return `${this.capitalize(entity)} not found`;
            case "P2015":
                return `Related record not found for ${entity}`;
            case "P2000":
                return `The provided value is too long for ${entity} field`;
            case "P2001":
                return `The ${entity} record searched for does not exist`;
            case "P2004":
                return `A constraint failed on the database for ${entity}`;
            case "P2028":
                return `Transaction error occurred for ${entity}`;
            default:
                return `${this.capitalize(entity)} operation failed`;
        }
    }
    createException(errorCode, message) {
        switch (errorCode) {
            case "P2002":
                return new common_1.ConflictException(message);
            case "P2025":
            case "P2016":
            case "P2001":
                return new common_1.NotFoundException(message);
            case "P2000":
            case "P2003":
            case "P2014":
            case "P2004":
                return new common_1.BadRequestException(message);
            default:
                return new common_1.InternalServerErrorException(message);
        }
    }
    getUniqueConstraintMessage(error, entity, uniqueFieldMap) {
        const meta = error.meta;
        const target = meta?.target?.[0];
        if (target && uniqueFieldMap[target]) {
            return uniqueFieldMap[target];
        }
        const defaultFieldMessages = {
            name: `${this.capitalize(entity)} name already exists`,
            email: `${this.capitalize(entity)} email already exists`,
            phone: `${this.capitalize(entity)} phone number already exists`,
            code: `${this.capitalize(entity)} code already exists`,
            username: `${this.capitalize(entity)} username already exists`,
        };
        if (target && defaultFieldMessages[target]) {
            return defaultFieldMessages[target];
        }
        return `${this.capitalize(entity)} with provided data already exists`;
    }
    getForeignKeyMessage(error, entity, foreignKeyMap) {
        const meta = error.meta;
        const field = meta?.field_name;
        if (field && foreignKeyMap[field]) {
            return foreignKeyMap[field];
        }
        const defaultFieldMessages = {
            managerId: "Assigned manager does not exist",
            userId: "Referenced user does not exist",
            branchId: "Referenced branch does not exist",
            categoryId: "Referenced category does not exist",
            createdById: "Referenced creator does not exist",
        };
        if (field && defaultFieldMessages[field]) {
            return defaultFieldMessages[field];
        }
        return `Related record not found for ${entity}`;
    }
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    async wrapPrismaCall(prismaCall, options = {}) {
        try {
            return await prismaCall();
        }
        catch (error) {
            this.handleError(error, options);
        }
    }
    isPrismaError(error) {
        return error instanceof client_1.Prisma.PrismaClientKnownRequestError;
    }
};
exports.PrismaErrorHandler = PrismaErrorHandler;
exports.PrismaErrorHandler = PrismaErrorHandler = __decorate([
    (0, common_1.Injectable)()
], PrismaErrorHandler);
//# sourceMappingURL=prisma-error.utils.js.map