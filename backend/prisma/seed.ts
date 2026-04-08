import { PrismaClient, Prisma, Role, TaskStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const password = await bcrypt.hash("password123", 10);

    // Users
    const admin = await tx.user.upsert({
      where: { email: "admin@taskflow.com" },
      update: {},
      create: {
        name: "Alice Admin",
        email: "admin@taskflow.com",
        password,
        role: Role.ADMIN,
      },
    });

    const user1 = await tx.user.upsert({
      where: { email: "bob@taskflow.com" },
      update: {},
      create: {
        name: "Bob Developer",
        email: "bob@taskflow.com",
        password,
        role: Role.USER,
      },
    });

    const user2 = await tx.user.upsert({
      where: { email: "carol@taskflow.com" },
      update: {},
      create: {
        name: "Carol Designer",
        email: "carol@taskflow.com",
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

    const task2 = await tx.task.create({
      data: {
        title: "Design Landing Page",
        description: "Create mockups for the new landing page",
        status: TaskStatus.PENDING,
        assigneeId: user2.id,
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
            entityId: task2.id,
            before: Prisma.JsonNull,
            after: {
              title: task2.title,
              status: "PENDING",
              assigneeId: user2.id,
              createdById: admin.id,
            },
            userId: admin.id,
            taskId: task2.id,
          },

          // Task 3 created
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

          // Assignment change (Task 2)
          {
            action: "ASSIGNMENT_CHANGED",
            entity: "TASK",
            entityId: task2.id,
            before: { assigneeId: null },
            after: { assigneeId: user2.id },
            userId: admin.id,
            taskId: task2.id,
          },
        ],
      });
    }

    console.log("✅ Seeded successfully:", {
      admin: admin.email,
      users: [user1.email, user2.email],
      tasks: [task1.title, task2.title, task3.title],
    });
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
