# FlowForge

**Plan Faster. Focus Better. Deliver Smarter.**

FlowForge is a premium 2026-style SaaS productivity platform inspired by the best parts of Kanban boards, sprint management, team collaboration, Pomodoro focus systems, and AI planning. The repository is a production-grade MERN monorepo with a cinematic Next.js frontend and a secured Express/MongoDB backend.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, React Three Fiber, Zustand, TanStack Query, Socket.io Client, shadcn-style Radix primitives
- Backend: Node.js, Express 5, MongoDB, Mongoose 9, Socket.io, JWT auth, Redis, BullMQ, Cloudinary, Zod validation
- DevOps: Docker Compose, CI-ready GitHub Actions, env templates, security middleware, rate limiting, structured logging

## Monorepo

```text
apps/
  web/      Next.js app, animated product UI, app shell, dashboard, board, focus, calendar, analytics, auth
  api/      Express API, Mongoose schemas, Socket.io, queues, auth, REST modules
docs/       Architecture, API, ER diagram, deployment guide
```

## Quick Start

```bash
npm install
cp .env.example .env
docker compose up -d mongo redis
npm run dev:api
npm run dev:web
```

`docker compose up --build` also works without a local `.env` because the compose file includes development-safe service defaults.

Open:

- Web: `http://localhost:3000`
- API health: `http://localhost:4000/health`

Seed demo data after MongoDB is running:

```bash
npm run seed
```

Demo login seed:

- Email: `avery@flowforge.demo`
- Password: `FlowForgeDemo123!`

## Key Product Modules

- Authentication: signup, login, OAuth placeholders, forgot password, email verification, 2FA-ready UI, device sessions
- Dashboard: sprint health, productivity analytics, team workload, activity stream, focus insights
- Workspace: multiple workspaces, invites, role settings, workspace preferences
- Kanban: drag/drop board, custom statuses, labels, due dates, comments, attachments, activity timeline, archive flow
- Tasks: rich brief editor surface, checklists, subtasks, dependencies, story points, recurring rule API, AI summaries
- Pomodoro: timer modes, stopwatch, fullscreen focus mode, mini timer-ready state, ambient settings, heatmap, leaderboard
- Realtime: presence, task updates, typing indicators, live notifications
- AI: task generation, sprint planning, summaries, prioritization contracts
- Calendar: weekly timeline, agenda, Google Calendar sync contract
- Profile: stats, activity graph, achievements, notification settings, security settings

## Useful Commands

```bash
npm run dev:web
npm run dev:api
npm run build
npm run typecheck
npm run seed
docker compose up --build
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [ER Diagram](docs/ER_DIAGRAM.md)
- [Deployment](docs/DEPLOYMENT.md)

## Production Notes

Before production launch, connect real OAuth apps, SMTP, Cloudinary, MongoDB Atlas, Redis Cloud, and the AI provider. Rotate JWT secrets, configure domain cookies, enable HTTPS, and add end-to-end tests around auth, billing, invites, task movement, and focus session persistence.
