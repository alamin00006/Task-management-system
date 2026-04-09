import { TasksService } from "../modules/tasks/tasks.service";
import { CreateTaskDto } from "../modules/tasks/dto/create-task.dto";
import { UpdateTaskDto } from "../modules/tasks/dto/update-task.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
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
    findMyTasks(userId: string): Promise<{
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
    update(id: string, dto: UpdateTaskDto, userId: string): Promise<{
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
    updateStatus(id: string, status: string, userId: string): Promise<{
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
    assign(id: string, assigneeId: string, userId: string): Promise<{
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
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
