import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { AuditService } from "./audit.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";

@Controller("audit-logs")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * Get audit logs (Admin only) with pagination, search, and sorting
   *
   * @param paginationDto - Query params (page, limit, search, sortBy, sortOrder)
   * @returns Paginated audit logs with metadata
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.auditService.findAll(paginationDto);
  }
}
