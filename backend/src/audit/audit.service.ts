import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogData {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        taskId: data.entity === 'Task' ? data.entityId : null,
        before: data.before ?? undefined,
        after: data.after ?? undefined,
      },
    });
  }

  async findAll() {
    const logs = await this.prisma.auditLog.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString(),
      userId: log.userId,
      userName: log.user.name,
      action: log.action,
      entity: log.entity,
      entityId: log.entityId,
      before: log.before,
      after: log.after,
      details: this.formatDetails(log.action, log.before as any, log.after as any),
    }));
  }

  private formatDetails(
    action: string,
    before: Record<string, any> | null,
    after: Record<string, any> | null,
  ): string {
    switch (action) {
      case 'TASK_CREATED':
        return `Created task "${after?.title}"`;
      case 'TASK_DELETED':
        return `Deleted task "${before?.title}"`;
      case 'STATUS_CHANGED':
        return `Status: ${before?.status} → ${after?.status}`;
      case 'ASSIGNMENT_CHANGED':
        return `Reassigned task`;
      case 'TASK_UPDATED':
        return `Updated task "${after?.title}"`;
      default:
        return action;
    }
  }
}
