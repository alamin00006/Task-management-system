import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaErrorHandler } from "./prisma-error.utils";

@Global()
@Module({
  providers: [PrismaService, PrismaErrorHandler],
  exports: [PrismaService, PrismaErrorHandler],
})
export class PrismaModule {}
