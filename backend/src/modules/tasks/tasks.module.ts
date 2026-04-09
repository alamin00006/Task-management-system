import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { PrismaErrorHandler } from "../../prisma/prisma-error.utils";

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaErrorHandler],
})
export class TasksModule {}
