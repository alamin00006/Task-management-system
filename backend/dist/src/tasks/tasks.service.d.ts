import { PrismaService } from "../prisma/prisma.service";
import { PrismaErrorHandler } from "../prisma/prisma-error.utils";
import { AuditService } from "../modules/audit/audit.service";
import { CreateTaskDto } from "../modules/tasks/dto/create-task.dto";
import { UpdateTaskDto } from "../modules/tasks/dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
export declare class TasksService {
    private prisma;
    private auditService;
    private errorHandler;
    constructor(prisma: PrismaService, auditService: AuditService, errorHandler: PrismaErrorHandler);
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: any;
            title: any;
            description: any;
            status: any;
            assignee: {
                id: any;
                name: any;
                email: any;
            } | null;
            createdAt: any;
            createdBy: any;
            updatedAt: any;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByUser(userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        assignee: {
            id: any;
            name: any;
            email: any;
        } | null;
        createdAt: any;
        createdBy: any;
        updatedAt: any;
    }[]>;
    create(dto: CreateTaskDto, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        assignee: {
            id: any;
            name: any;
            email: any;
        } | null;
        createdAt: any;
        createdBy: any;
        updatedAt: any;
    }>;
    update(taskId: string, dto: UpdateTaskDto, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        assignee: {
            id: any;
            name: any;
            email: any;
        } | null;
        createdAt: any;
        createdBy: any;
        updatedAt: any;
    }>;
    updateStatus(taskId: string, status: string, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        assignee: {
            id: any;
            name: any;
            email: any;
        } | null;
        createdAt: any;
        createdBy: any;
        updatedAt: any;
    }>;
    assign(taskId: string, assigneeId: string, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        assignee: {
            id: any;
            name: any;
            email: any;
        } | null;
        createdAt: any;
        createdBy: any;
        updatedAt: any;
    }>;
    delete(taskId: string, userId: string): Promise<{
        message: string;
    }>;
}
