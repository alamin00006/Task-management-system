import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
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
}
