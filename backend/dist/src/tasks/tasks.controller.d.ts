import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
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
    findMyTasks(userId: string): Promise<{
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
    update(id: string, dto: UpdateTaskDto, userId: string): Promise<{
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
    updateStatus(id: string, status: string, userId: string): Promise<{
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
    assign(id: string, assigneeId: string, userId: string): Promise<{
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
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
