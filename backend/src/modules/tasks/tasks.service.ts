import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditEntity, TaskStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaErrorHandler } from "../../prisma/prisma-error.utils";
import { AuditService } from "../audit/audit.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";

/**
 * Map incoming status (string) to database enum
 */
const STATUS_MAP: Record<string, TaskStatus> = {
  Pending: TaskStatus.PENDING,
  Processing: TaskStatus.PROCESSING,
  Done: TaskStatus.DONE,
};

/**
 * Map database enum to readable display value
 */
const STATUS_DISPLAY: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.PROCESSING]: "Processing",
  [TaskStatus.DONE]: "Done",
};

/**
 * Include assignee info in all task queries
 */
const taskInclude = {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

/**
 * Format task response
 */
function formatTask(task: any) {
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
    updatedAt: task.updatedAt,
  };
}

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private errorHandler: PrismaErrorHandler,
  ) {}

  /**
   * Get all tasks with pagination, search, and sorting
   * @param paginationDto Pagination, search and sorting options
   * @returns Paginated list of formatted tasks with metadata
   */
  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = paginationDto;

    // Calculate how many records to skip
    const skip = (page - 1) * limit;

    // Build dynamic search condition
    const whereCondition: any = {};

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

    // Execute queries in parallel for better performance
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where: whereCondition,
        include: taskInclude, // include assignee
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

    // Return formatted response with metadata
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

  /**
   * Get all tasks assigned to a specific user
   * @param userId User ID
   * @returns List of formatted tasks
   */
  async findByUser(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { assigneeId: userId },
      include: taskInclude, // include assignee
      orderBy: { createdAt: "desc" },
    });

    return tasks.map(formatTask);
  }

  /**
   * Create a new task
   * @param dto Task creation data
   * @param userId ID of the user creating the task
   */
  async create(dto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description || "",
        assigneeId: dto.assigneeId,
        createdById: userId,
      },
      include: taskInclude, //  return assignee info
    });

    // Log audit trail
    await this.auditService.log({
      userId,
      action: "TASK_CREATED",
      entity: AuditEntity.TASK,
      entityId: task.id,
      after: formatTask(task),
    });

    return formatTask(task);
  }

  /**
   * Update task basic information (title, description)
   */
  async update(taskId: string, dto: UpdateTaskDto, userId: string) {
    const existing = await this.errorHandler.wrapPrismaCall(
      async () =>
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: taskInclude,
        }),
      { entity: "Task" },
    );

    const beforeData = formatTask(existing);
    const updateData: any = {};

    // Only update provided fields
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: taskInclude, //  include assignee
    });

    // Audit log for update
    await this.auditService.log({
      userId,
      action: "TASK_UPDATED",
      entity: AuditEntity.TASK,
      entityId: task.id,
      before: beforeData,
      after: formatTask(task),
    });

    return formatTask(task);
  }

  /**
   * Update task status
   */
  async updateStatus(taskId: string, status: string, userId: string) {
    const existing = await this.errorHandler.wrapPrismaCall(
      async () =>
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: taskInclude,
        }),
      { entity: "Task" },
    );

    const beforeData = formatTask(existing);

    // Convert input status to database enum
    const dbStatus =
      STATUS_MAP[status] ||
      (status.toUpperCase().replace(/ /g, "_") as TaskStatus);

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { status: dbStatus },
      include: taskInclude,
    });

    // Audit log for status change
    await this.auditService.log({
      userId,
      action: "STATUS_CHANGED",
      entity: AuditEntity.TASK,
      entityId: task.id,
      before: beforeData,
      after: formatTask(task),
    });

    return formatTask(task);
  }

  /**
   * Assign task to a user
   */
  async assign(taskId: string, assigneeId: string, userId: string) {
    const existing = await this.errorHandler.wrapPrismaCall(
      async () =>
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: taskInclude,
        }),
      { entity: "Task" },
    );

    const beforeData = formatTask(existing);

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
      include: taskInclude,
    });

    // Audit log for assignment change
    await this.auditService.log({
      userId,
      action: "ASSIGNMENT_CHANGED",
      entity: AuditEntity.TASK,
      entityId: task.id,
      before: beforeData,
      after: formatTask(task),
    });

    return formatTask(task);
  }

  /**
   * Delete a task
   */
  async delete(taskId: string, userId: string) {
    const existing = await this.errorHandler.wrapPrismaCall(
      async () =>
        await this.prisma.task.findUnique({
          where: { id: taskId },
          include: taskInclude,
        }),
      { entity: "Task" },
    );

    const beforeData = formatTask(existing);

    // Log deletion before removing data
    await this.auditService.log({
      userId,
      action: "TASK_DELETED",
      entity: AuditEntity.TASK,
      entityId: taskId,
      before: beforeData,
    });

    await this.prisma.task.delete({ where: { id: taskId } });

    return { message: "Task deleted" };
  }
}
