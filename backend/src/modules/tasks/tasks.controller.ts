import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/common/guards/roles.guard";
import { TasksService } from "./tasks.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Controller("tasks")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * Get all tasks (Admin only) with pagination, search, and sorting.
   * Requires JWT authentication and Admin role.
   *
   * @param paginationDto - Pagination, search, and sorting query params
   * @returns Paginated list of tasks with metadata
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  /**
   * Get tasks assigned to the currently authenticated user.
   * Requires JWT authentication.
   *
   * @param userId - Current user's ID (injected via decorator)
   * @returns List of tasks assigned to the user
   */
  @Get("my")
  async findMyTasks(@CurrentUser("id") userId: string) {
    return this.tasksService.findByUser(userId);
  }

  /**
   * Create a new task (Admin only).
   * Requires JWT authentication and Admin role.
   *
   * @param dto - Task creation payload
   * @param userId - ID of the user creating the task
   * @returns Created task object
   */
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateTaskDto, @CurrentUser("id") userId: string) {
    return this.tasksService.create(dto, userId);
  }

  /**
   * Update task basic information (title, description).
   * Admin only.
   *
   * @param id - Task ID
   * @param dto - Update payload
   * @param userId - Current user's ID
   * @returns Updated task
   */
  @Patch(":id")
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  /**
   * Update task status.
   * Accessible by authenticated users.
   *
   * @param id - Task ID
   * @param status - New status ("Pending", "In Progress", "Done")
   * @param userId - Current user's ID
   * @returns Updated task with new status
   */
  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.tasksService.updateStatus(id, status, userId);
  }

  /**
   * Assign task to a user (Admin only).
   *
   * @param id - Task ID
   * @param assigneeId - User ID to assign task
   * @param userId - Current user's ID (who performs assignment)
   * @returns Updated task
   */
  @Patch(":id/assign")
  @Roles(Role.ADMIN)
  async assign(
    @Param("id") id: string,
    @Body("assigneeId") assigneeId: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.tasksService.assign(id, assigneeId, userId);
  }

  /**
   * Delete a task (Admin only).
   * Logs audit before deletion.
   *
   * @param id - Task ID
   * @param userId - Current user's ID
   * @returns Success message
   */
  @Delete(":id")
  @Roles(Role.ADMIN)
  async delete(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.tasksService.delete(id, userId);
  }
}
