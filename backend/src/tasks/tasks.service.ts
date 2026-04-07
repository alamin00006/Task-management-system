import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const STATUS_MAP: Record<string, TaskStatus> = {
  'To Do': TaskStatus.TODO,
  'In Progress': TaskStatus.IN_PROGRESS,
  'In Review': TaskStatus.IN_REVIEW,
  'Done': TaskStatus.DONE,
};

const STATUS_DISPLAY: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.IN_REVIEW]: 'In Review',
  [TaskStatus.DONE]: 'Done',
};

const PRIORITY_DISPLAY: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

function formatTask(task: any) {
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

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    const tasks = await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map(formatTask);
  }

  async findByUser(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { assigneeId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks.map(formatTask);
  }

  async create(dto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description || '',
        priority: dto.priority.toUpperCase() as any,
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

  async update(taskId: string, dto: UpdateTaskDto, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundException('Task not found');

    const beforeData = formatTask(existing);
    const updateData: any = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.priority !== undefined) updateData.priority = dto.priority.toUpperCase();
    if (dto.dueDate !== undefined) updateData.dueDate = new Date(dto.dueDate);

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

  async updateStatus(taskId: string, status: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundException('Task not found');

    const beforeData = formatTask(existing);
    const dbStatus = STATUS_MAP[status] || status.toUpperCase().replace(/ /g, '_') as TaskStatus;

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

  async assign(taskId: string, assigneeId: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundException('Task not found');

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

  async delete(taskId: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundException('Task not found');

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
}
