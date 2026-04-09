import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TasksModule, AuditModule],
})
export class AppModule {}
