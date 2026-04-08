import { PrismaService } from "../prisma/prisma.service";
import { PrismaErrorHandler } from "../prisma/prisma-error.utils";
import { AuditService } from "../audit/audit.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
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
    }>;
    delete(taskId: string, userId: string): Promise<{
        message: string;
    }>;
}
