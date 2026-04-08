import { Global, Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";
import { PrismaErrorHandler } from "../prisma/prisma-error.utils";

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService, PrismaErrorHandler],
  exports: [AuditService],
})
export class AuditModule {}
