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
const audit_service_1 = require("../audit/audit.service");
const STATUS_MAP = {
    'To Do': client_1.TaskStatus.TODO,
    'In Progress': client_1.TaskStatus.IN_PROGRESS,
    'In Review': client_1.TaskStatus.IN_REVIEW,
    'Done': client_1.TaskStatus.DONE,
};
const STATUS_DISPLAY = {
    [client_1.TaskStatus.TODO]: 'To Do',
    [client_1.TaskStatus.IN_PROGRESS]: 'In Progress',
    [client_1.TaskStatus.IN_REVIEW]: 'In Review',
    [client_1.TaskStatus.DONE]: 'Done',
};
const PRIORITY_DISPLAY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
};
function formatTask(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: STATUS_DISPLAY[task.status] || task.status,
        priority: PRIORITY_DISPLAY[task.priority] || task.priority,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        createdAt: task.createdAt.toISOString(),
        createdBy: task.createdById,
    };
}
let TasksService = class TasksService {
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async findAll() {
        const tasks = await this.prisma.task.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return tasks.map(formatTask);
    }
    async findByUser(userId) {
        const tasks = await this.prisma.task.findMany({
            where: { assigneeId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return tasks.map(formatTask);
    }
    async create(dto, userId) {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description || '',
                priority: dto.priority.toUpperCase(),
                assigneeId: dto.assigneeId,
                createdById: userId,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });
        await this.auditService.log({
            userId,
            action: 'TASK_CREATED',
            entity: 'Task',
            entityId: task.id,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async update(taskId, dto, userId) {
        const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        const beforeData = formatTask(existing);
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.priority !== undefined)
            updateData.priority = dto.priority.toUpperCase();
        if (dto.dueDate !== undefined)
            updateData.dueDate = new Date(dto.dueDate);
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });
        await this.auditService.log({
            userId,
            action: 'TASK_UPDATED',
            entity: 'Task',
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async updateStatus(taskId, status, userId) {
        const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        const beforeData = formatTask(existing);
        const dbStatus = STATUS_MAP[status] || status.toUpperCase().replace(/ /g, '_');
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: { status: dbStatus },
        });
        await this.auditService.log({
            userId,
            action: 'STATUS_CHANGED',
            entity: 'Task',
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async assign(taskId, assigneeId, userId) {
        const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        const beforeData = formatTask(existing);
        const task = await this.prisma.task.update({
            where: { id: taskId },
            data: { assigneeId },
        });
        await this.auditService.log({
            userId,
            action: 'ASSIGNMENT_CHANGED',
            entity: 'Task',
            entityId: task.id,
            before: beforeData,
            after: formatTask(task),
        });
        return formatTask(task);
    }
    async delete(taskId, userId) {
        const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!existing)
            throw new common_1.NotFoundException('Task not found');
        const beforeData = formatTask(existing);
        await this.auditService.log({
            userId,
            action: 'TASK_DELETED',
            entity: 'Task',
            entityId: taskId,
            before: beforeData,
        });
        await this.prisma.task.delete({ where: { id: taskId } });
        return { message: 'Task deleted' };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map