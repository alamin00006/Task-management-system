import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaErrorHandler } from "../prisma/prisma-error.utils";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaErrorHandler],
  exports: [UsersService],
})
export class UsersModule {}
