# 🧩 Task Management System

A simple and scalable Task Management System built as part of a hiring assignment.
The system focuses on **clean architecture, role-based access control, and audit logging**.

---

## 🚀 Tech Stack

**Frontend**

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**

- NestJS
- PostgreSQL
- Prisma

**Others**

- JWT Authentication
- Docker

---

## ✨ Features

### 🔐 Authentication

- JWT-based authentication
- Predefined users (Admin & User)

---

### 👤 User Roles

#### Admin

- Create tasks
- Update tasks
- Delete tasks
- Assign tasks to users
- View audit logs

#### User

- View assigned tasks
- Update task status

---

### 📋 Task Management

Each task contains:

- Title
- Description
- Status (PENDING, PROCESSING, DONE)
- Assigned user
- Created & updated timestamps

---

### 📊 Audit Logging (Core Feature)

All important actions are logged:

- Task creation
- Task updates
- Task deletion
- Status changes
- Assignment changes

Each log includes:

- Actor (who performed the action)
- Action type
- Target entity (task)
- Before & after data

---

## 🏗️ Architecture Overview

- Auth Module → Authentication & authorization
- User Module → User & role management
- Task Module → Core task logic
- AuditLog Module → Tracks system actions

Audit logging is implemented at the **service layer** to ensure all business actions are captured.
This approach ensures all business logic actions are consistently tracked without duplicating logging logic.

---

## 🗄️ Database Schema

**Tables:**

- users
- tasks
- audit_logs

**Relationships:**

- A task is assigned to a user (Many-to-One)
- Audit logs reference:
  - actor (user)
  - target (task)

---

## ⚙️ Setup Instructions

### 🐳 Run with Docker

```bash
docker compose up --build
```

---

## 🌐 Application URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/v1

---

### 🔧 Manual Setup

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

### Admin

```
email: admin@alamin.com
password: password123
```

### User

```
email: user1@alamin.com
password: password123
```

---

## 🎥 Video

👉 [Watch Video](https://drive.google.com/file/d/1CeaPHpdp1uiCgE_FJ0frPZVsgP-tfnd4/view?usp=sharing)

---

## 📦 API Overview

- POST /auth/login
- GET /tasks
- POST /tasks
- PATCH /tasks/:id
- DELETE /tasks/:id
- GET /audit-logs

---

## 🤖 AI Usage

AI tools were used selectively to assist development, mainly for **architecture validation, audit logging design, and code refinement**.

### 🔹 1. Architecture Planning

```text
I am building a Task Management System using NestJS and PostgreSQL.

Help me design a clean and simple modular architecture with:
- Role-based access (Admin, User)
- Task management
- Audit logging

Keep it minimal but production-ready. Also explain key design decisions.
```

Used to:

- Validate module structure
- Ensure clean separation of concerns

---

### 🔹 2. Audit Logging Design (Core Feature)

```text
Design a simple but effective audit logging system for tracking:
- Task creation, update, deletion
- Status changes
- Assignment changes

Each log should include actor, action, and before/after data.

Keep it easy to implement and easy to explain.
```

Used to:

- Design audit log schema
- Decide logging strategy (service layer)

---

### 🔹 3. Code Refactoring

```text
Refactor this NestJS service to improve readability, error handling, and maintainability.
```

Used to:

- Improve code quality
- Follow best practices

---

### 📌 Note

All AI-generated outputs were **reviewed, modified, and adapted manually** to meet project requirements.

---

## 📌 Key Decisions

- Kept architecture simple and modular
- Focused on audit logging (core requirement)
- Avoided overengineering
- Prioritized clean, maintainable code

---

## 📎 Submission

- GitHub Repository: [View Source Code](https://github.com/alamin00006/Task-management-system)
- Docker Setup: Included
- Demo Credentials: Provided
- Demo Video: Included

---

## 🙌 Final Note

This project focuses on **clarity, maintainability, and proper architecture decisions** rather than feature overload.
