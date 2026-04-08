"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.$transaction(async (tx) => {
        const password = await bcrypt.hash("password123", 10);
        const admin = await tx.user.upsert({
            where: { email: "admin@taskflow.com" },
            update: {},
            create: {
                name: "Alice Admin",
                email: "admin@taskflow.com",
                password,
                role: client_1.Role.ADMIN,
            },
        });
        const user1 = await tx.user.upsert({
            where: { email: "bob@taskflow.com" },
            update: {},
            create: {
                name: "Bob Developer",
                email: "bob@taskflow.com",
                password,
                role: client_1.Role.USER,
            },
        });
        const user2 = await tx.user.upsert({
            where: { email: "carol@taskflow.com" },
            update: {},
            create: {
                name: "Carol Designer",
                email: "carol@taskflow.com",
                password,
                role: client_1.Role.USER,
            },
        });
        const task1 = await tx.task.create({
            data: {
                title: "Setup CI/CD Pipeline",
                description: "Configure GitHub Actions for automated testing and deployment",
                status: client_1.TaskStatus.PROCESSING,
                assigneeId: user1.id,
                createdById: admin.id,
            },
        });
        const task2 = await tx.task.create({
            data: {
                title: "Design Landing Page",
                description: "Create mockups for the new landing page",
                status: client_1.TaskStatus.PENDING,
                assigneeId: user2.id,
                createdById: admin.id,
            },
        });
        const task3 = await tx.task.create({
            data: {
                title: "Write API Documentation",
                description: "Document all REST endpoints with examples",
                status: client_1.TaskStatus.PENDING,
                assigneeId: user1.id,
                createdById: admin.id,
            },
        });
        const existingLogs = await tx.auditLog.count();
        if (existingLogs === 0) {
            await tx.auditLog.createMany({
                data: [
                    {
                        action: "TASK_CREATED",
                        entity: "TASK",
                        entityId: task1.id,
                        before: client_1.Prisma.JsonNull,
                        after: {
                            title: task1.title,
                            status: "PROCESSING",
                            assigneeId: user1.id,
                            createdById: admin.id,
                        },
                        userId: admin.id,
                        taskId: task1.id,
                    },
                    {
                        action: "STATUS_CHANGED",
                        entity: "TASK",
                        entityId: task1.id,
                        before: { status: "PENDING" },
                        after: { status: "PROCESSING" },
                        userId: admin.id,
                        taskId: task1.id,
                    },
                    {
                        action: "TASK_CREATED",
                        entity: "TASK",
                        entityId: task2.id,
                        before: client_1.Prisma.JsonNull,
                        after: {
                            title: task2.title,
                            status: "PENDING",
                            assigneeId: user2.id,
                            createdById: admin.id,
                        },
                        userId: admin.id,
                        taskId: task2.id,
                    },
                    {
                        action: "TASK_CREATED",
                        entity: "TASK",
                        entityId: task3.id,
                        before: client_1.Prisma.JsonNull,
                        after: {
                            title: task3.title,
                            status: "PENDING",
                            assigneeId: user1.id,
                            createdById: admin.id,
                        },
                        userId: admin.id,
                        taskId: task3.id,
                    },
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
//# sourceMappingURL=seed.js.map