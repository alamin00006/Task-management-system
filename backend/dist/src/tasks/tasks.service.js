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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_error_utils_1 = require("../prisma/prisma-error.utils");
const audit_service_1 = require("../audit/audit.service");
const STATUS_MAP = {
    Pending: client_1.TaskStatus.PENDING,
    Processing: client_1.TaskStatus.PROCESSING,
    Done: client_1.TaskStatus.DONE,
};
const STATUS_DISPLAY = {
    [client_1.TaskStatus.PENDING]: "Pending",
    [client_1.TaskStatus.PROCESSING]: "Processing",
    [client_1.TaskStatus.DONE]: "Done",
};
const taskInclude = {
    assignee: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};
function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: STATUS_DISPLAY[task.status] || task.status,
        assignee: task.assignee
            ? {
                id: task.assignee.id,
                name: task.assignee.name,
                email: task.assignee.email,
            }
            : null,
        createdAt: task.createdAt.toISOString(),
        createdBy: task.createdById,
    };
}
let TasksService = class TasksService {
    constructor(prisma, auditService, errorHandler) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.errorHandler = errorHandler;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc", } = paginationDto;
        const skip = (page - 1) * limit;
        const whereCondition = {};
        if (search) {
            whereCondition.OR = [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where: whereCondition,
                include: taskInclude,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            this.prisma.task.count({
                where: whereCondition,
            }),
        ]);
        return {
            data: tasks.map(formatTask),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findByUser(userId) {
        const tasks = await this.prisma.task.findMany({
            where: { assigneeId: userId },
            include: taskInclude,
            orderBy: { createdAt: "desc" },
        });
        return tasks.map(formatTask);
    }
    async create(dto, userId) {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description || "",
                assigneeId: dto.assigneeId,
                createdById: userId,
            },
            include: taskInclude,
        });
        await this.auditService.log({
            userId,
            action: "TASK_CREATED",
            entity: client_1.AuditEntity.TASK,
            entityId: task.id,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async update(taskId, dto, userId) {
        const existing = await this.errorHandler.wrapPrismaCall(async () => await this.prisma.task.findUnique({
            where: { id: taskId },
            include: taskInclude,
        }), { entity: "Task" });
        const beforeData = formatTask(existing);
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: updateData,
            include: taskInclude,
        });
        await this.auditService.log({
            userId,
            action: "TASK_UPDATED",
            entity: client_1.AuditEntity.TASK,
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async updateStatus(taskId, status, userId) {
        const existing = await this.errorHandler.wrapPrismaCall(async () => await this.prisma.task.findUnique({
            where: { id: taskId },
            include: taskInclude,
        }), { entity: "Task" });
        const beforeData = formatTask(existing);
        const dbStatus = STATUS_MAP[status] ||
            status.toUpperCase().replace(/ /g, "_");
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: { status: dbStatus },
            include: taskInclude,
        });
        await this.auditService.log({
            userId,
            action: "STATUS_CHANGED",
            entity: client_1.AuditEntity.TASK,
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async assign(taskId, assigneeId, userId) {
        const existing = await this.errorHandler.wrapPrismaCall(async () => await this.prisma.task.findUnique({
            where: { id: taskId },
            include: taskInclude,
        }), { entity: "Task" });
        const beforeData = formatTask(existing);
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: { assigneeId },
            include: taskInclude,
        });
        await this.auditService.log({
            userId,
            action: "ASSIGNMENT_CHANGED",
            entity: client_1.AuditEntity.TASK,
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async delete(taskId, userId) {
        const existing = await this.errorHandler.wrapPrismaCall(async () => await this.prisma.task.findUnique({
            where: { id: taskId },
            include: taskInclude,
        }), { entity: "Task" });
        const beforeData = formatTask(existing);
        await this.auditService.log({
            userId,
            action: "TASK_DELETED",
            entity: client_1.AuditEntity.TASK,
            entityId: taskId,
            before: beforeData,
        });
        await this.prisma.task.delete({ where: { id: taskId } });
        return { message: "Task deleted" };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        prisma_error_utils_1.PrismaErrorHandler])
], TasksService);
//# sourceMappingURL=tasks.service.js.map