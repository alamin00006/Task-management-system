import { PrismaService } from '../prisma/prisma.service';
export interface AuditLogData {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: AuditLogData): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        taskId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        timestamp: string;
        userId: string;
        userName: string;
        action: string;
        entity: string;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue;
        after: import("@prisma/client/runtime/library").JsonValue;
        details: string;
    }[]>;
    private formatDetails;
}
