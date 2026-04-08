import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AuditAction, AuditEntity } from "@prisma/client";
export interface AuditLogData {
    userId: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    before?: Record<string, any> | null;
    after?: Record<string, any> | null;
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: AuditLogData): Promise<{
        id: string;
        action: import(".prisma/client").$Enums.AuditAction;
        entity: import(".prisma/client").$Enums.AuditEntity;
        entityId: string;
        before: import("@prisma/client/runtime/library").JsonValue | null;
        after: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        userId: string;
        taskId: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: string;
            timestamp: string;
            userId: string;
            userName: string;
            action: import(".prisma/client").$Enums.AuditAction;
            entity: "TASK";
            entityId: string;
            before: import("@prisma/client/runtime/library").JsonValue;
            after: import("@prisma/client/runtime/library").JsonValue;
            details: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    private formatDetails;
}
