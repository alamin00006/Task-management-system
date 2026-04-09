import { AuditService } from "./audit.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
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
}
