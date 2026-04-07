# Task Flow Backend

NestJS + Prisma + PostgreSQL backend for the Task Management System.

## Setup

```bash
cd backend
npm install

# Copy env
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed database
npx ts-node prisma/seed.ts

# Start dev server
npm run start:dev
```

## API Endpoints

### Auth
- `POST /api/auth/login` — Login with email/password
- `GET /api/auth/profile` — Get current user profile (JWT required)

### Users
- `GET /api/users` — List all users (JWT required)

### Tasks
- `GET /api/tasks` — All tasks (Admin only)
- `GET /api/tasks/my` — My assigned tasks (any authenticated user)
- `POST /api/tasks` — Create task (Admin only)
- `PATCH /api/tasks/:id` — Update task (Admin only)
- `PATCH /api/tasks/:id/status` — Update status (any authenticated user)
- `PATCH /api/tasks/:id/assign` — Reassign task (Admin only)
- `DELETE /api/tasks/:id` — Delete task (Admin only)

### Audit Logs
- `GET /api/audit-logs` — All audit logs (Admin only)

## Seed Credentials

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | admin@taskflow.com | password123 |
| User  | bob@taskflow.com   | password123 |
| User  | carol@taskflow.com | password123 |

## Architecture

```
backend/src/
├── auth/          # JWT auth, login, guards
├── users/         # User listing
├── tasks/         # Task CRUD with audit logging
├── audit/         # Audit log service & controller
├── prisma/        # Database service
└── common/        # Decorators (@Roles, @CurrentUser), Guards
```

Every task mutation (create, update, delete, status change, assignment) is automatically audit-logged with before/after snapshots.
