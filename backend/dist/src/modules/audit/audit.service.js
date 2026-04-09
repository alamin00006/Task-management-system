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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(data) {
        return this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                taskId: data.entity === client_1.AuditEntity.TASK ? data.entityId : null,
                before: data.before ?? undefined,
                after: data.after ?? undefined,
            },
        });
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", } = paginationDto;
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (search) {
            whereCondition.OR = [
                {
                    action: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    entity: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where: whereCondition,
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count({
                where: whereCondition,
            }),
        ]);
        return {
            data: logs.map((log) => ({
                id: log.id,
                timestamp: log.createdAt.toISOString(),
                userId: log.userId,
                userName: log.user.name,
                action: log.action,
                entity: log.entity,
                entityId: log.entityId,
                before: log.before,
                after: log.after,
                details: this.formatDetails(log.action, log.before, log.after),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    formatDetails(action, before, after) {
        switch (action) {
            case "TASK_CREATED":
                return `Created task "${after?.title}"`;
            case "TASK_DELETED":
                return `Deleted task "${before?.title}"`;
            case "STATUS_CHANGED":
                return `Status: ${before?.status} → ${after?.status}`;
            case "ASSIGNMENT_CHANGED":
                return `Task reassigned`;
            case "TASK_UPDATED":
                return `Updated task "${after?.title}"`;
            default:
                return action;
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map