import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      name: 'Alice Admin',
      email: 'admin@taskflow.com',
      password,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'bob@taskflow.com' },
    update: {},
    create: {
      name: 'Bob Developer',
      email: 'bob@taskflow.com',
      password,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'carol@taskflow.com' },
    update: {},
    create: {
      name: 'Carol Designer',
      email: 'carol@taskflow.com',
      password,
      role: Role.USER,
    },
  });

  // Seed tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: user1.id,
        createdById: admin.id,
        dueDate: new Date('2026-04-15'),
      },
      {
        title: 'Design Landing Page',
        description: 'Create mockups for the new landing page',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: user2.id,
        createdById: admin.id,
        dueDate: new Date('2026-04-20'),
      },
      {
        title: 'Write API Documentation',
        description: 'Document all REST endpoints with examples',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assigneeId: user1.id,
        createdById: admin.id,
        dueDate: new Date('2026-04-25'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeded:', { admin: admin.email, user1: user1.email, user2: user2.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
