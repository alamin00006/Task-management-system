import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    private auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    findAll(): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }[]>;
    findByUser(userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }[]>;
    create(dto: CreateTaskDto, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }>;
    update(taskId: string, dto: UpdateTaskDto, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }>;
    updateStatus(taskId: string, status: string, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }>;
    assign(taskId: string, assigneeId: string, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        status: any;
        priority: any;
        assigneeId: any;
        dueDate: any;
        createdAt: any;
        createdBy: any;
    }>;
    delete(taskId: string, userId: string): Promise<{
        message: string;
    }>;
}
