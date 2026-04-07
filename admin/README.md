# Task Flow — Next.js Admin Dashboard

## Setup

```bash
cd nextjsAdmin
npm install
cp .env.local.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port Next.js assigns).

## Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Redirects to /login
│   ├── not-found.tsx       # 404 page
│   ├── globals.css         # Tailwind + design tokens
│   ├── login/page.tsx      # Login page
│   └── dashboard/
│       ├── layout.tsx      # Sidebar + auth guard
│       ├── page.tsx        # Dashboard home (stats)
│       ├── create/page.tsx # Create task (admin)
│       ├── tasks/page.tsx  # All tasks (admin)
│       ├── my-tasks/page.tsx # My tasks (user)
│       └── logs/page.tsx   # Audit logs with diff viewer
├── contexts/               # AuthContext, TaskContext
├── lib/                    # API client, utils
└── types/                  # TypeScript interfaces
```

## Demo Credentials

- **Admin:** admin@taskflow.com / password123
- **User:** bob@taskflow.com / password123
