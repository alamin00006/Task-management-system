import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuditAction, AuditEntity } from "@prisma/client";

/**
 * Interface representing audit log payload
 */
export interface AuditLogData {
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new audit log entry
   * Used across the application to track changes in entities
   *
   * @param data - Audit log payload containing action details
   * @returns Created audit log record
   */
  async log(data: AuditLogData) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,

        // Store taskId separately for easier filtering (if entity is Task)
        taskId: data.entity === AuditEntity.TASK ? data.entityId : null,

        // Store before/after snapshots (optional)
        before: data.before ?? undefined,
        after: data.after ?? undefined,
      },
    });
  }

  /**
   * Retrieve audit logs with pagination, search, and sorting
   *
   * @param paginationDto - Pagination, search and sorting options
   * @returns Paginated audit logs with metadata
   */
  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = paginationDto;

    const skip = (page - 1) * limit;

    //  Search condition
    const whereCondition: any = {};

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

    //  Run queries in parallel
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

    //  Format response
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
        details: this.formatDetails(
          log.action,
          log.before as any,
          log.after as any,
        ),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Generate human-readable descriptions for audit logs
   * Helps frontend display meaningful activity messages
   *
   * @param action - Action type (e.g., TASK_CREATED)
   * @param before - Previous state
   * @param after - Updated state
   * @returns Formatted description string
   */
  private formatDetails(
    action: string,
    before: Record<string, any> | null,
    after: Record<string, any> | null,
  ): string {
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
}
