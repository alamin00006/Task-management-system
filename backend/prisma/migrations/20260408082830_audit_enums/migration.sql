/*
  Warnings:

  - The `entity` column on the `audit_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `action` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED', 'STATUS_CHANGED', 'ASSIGNMENT_CHANGED');

-- CreateEnum
CREATE TYPE "AuditEntity" AS ENUM ('TASK');

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "action",
ADD COLUMN     "action" "AuditAction" NOT NULL,
DROP COLUMN "entity",
ADD COLUMN     "entity" "AuditEntity" NOT NULL DEFAULT 'TASK';

-- DropEnum
DROP TYPE "TaskPriority";

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_task_id_idx" ON "audit_logs"("task_id");

-- CreateIndex
CREATE INDEX "tasks_assignee_id_idx" ON "tasks"("assignee_id");

-- CreateIndex
CREATE INDEX "tasks_created_by_id_idx" ON "tasks"("created_by_id");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_created_at_idx" ON "tasks"("created_at");
