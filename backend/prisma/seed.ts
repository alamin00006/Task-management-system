import { PrismaClient, Prisma, Role, TaskStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const password = await bcrypt.hash("password123", 10);

    // Users
    const admin = await tx.user.upsert({
      where: { email: "admin@alamin.com" },
      update: {},
      create: {
        name: "Alamin Admin",
        email: "admin@alamin.com",
        password,
        role: Role.ADMIN,
      },
    });

    const user1 = await tx.user.upsert({
      where: { email: "user@alamin.com" },
      update: {},
      create: {
        name: "Developer",
        email: "user@alamin.com",
        password,
        role: Role.USER,
      },
    });

    // Tasks (no hardcoded IDs)
    const task1 = await tx.task.create({
      data: {
        title: "Setup CI/CD Pipeline",
        description:
          "Configure GitHub Actions for automated testing and deployment",
        status: TaskStatus.PROCESSING,
        assigneeId: user1.id,
        createdById: admin.id,
      },
    });

    const task3 = await tx.task.create({
      data: {
        title: "Write API Documentation",
        description: "Document all REST endpoints with examples",
        status: TaskStatus.PENDING,
        assigneeId: user1.id,
        createdById: admin.id,
      },
    });

    // Prevent duplicate logs
    const existingLogs = await tx.auditLog.count();

    if (existingLogs === 0) {
      await tx.auditLog.createMany({
        data: [
          // Task 1 created (correct status)
          {
            action: "TASK_CREATED",
            entity: "TASK",
            entityId: task1.id,
            before: Prisma.JsonNull,
            after: {
              title: task1.title,
              status: "PROCESSING",
              assigneeId: user1.id,
              createdById: admin.id,
            },
            userId: admin.id,
            taskId: task1.id,
          },

          // Task 1 status already PROCESSING (no mismatch now)
          {
            action: "STATUS_CHANGED",
            entity: "TASK",
            entityId: task1.id,
            before: { status: "PENDING" },
            after: { status: "PROCESSING" },
            userId: admin.id,
            taskId: task1.id,
          },

          // Task 2 created
          {
            action: "TASK_CREATED",
            entity: "TASK",
            entityId: task3.id,
            before: Prisma.JsonNull,
            after: {
              title: task3.title,
              status: "PENDING",
              assigneeId: user1.id,
              createdById: admin.id,
            },
            userId: admin.id,
            taskId: task3.id,
          },
        ],
      });
    }

    console.log(" Seeded successfully:", {
      admin: admin.email,
      users: [user1.email],
    });
  });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
