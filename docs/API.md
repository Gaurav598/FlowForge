# FlowForge API

Base URL: `/api`

## Auth

- `POST /auth/register` creates user, workspace, owner membership, device session, access and refresh cookies.
- `POST /auth/login` verifies credentials and creates a new device session.
- `POST /auth/refresh` rotates the access token from a valid refresh cookie.
- `POST /auth/logout` clears auth cookies.
- `GET /auth/me` returns the current user.
- `GET /auth/devices` lists active device sessions.
- `POST /auth/forgot-password` starts password recovery.
- `POST /auth/verify-email` marks verification flow complete.
- `POST /auth/2fa/enable` returns a 2FA setup placeholder.
- `GET /auth/oauth/:provider` is the provider handoff placeholder.

## Workspaces

- `GET /workspaces` lists workspaces for the current user.
- `POST /workspaces` creates a workspace.
- `POST /workspaces/:workspaceId/invites` creates an invite token.
- `PATCH /workspaces/:workspaceId/settings` updates sprint, focus, AI, and calendar settings.

## Boards

- `GET /boards?workspaceId=` lists boards.
- `POST /boards` creates a Kanban/Scrum/Hybrid board.
- `GET /boards/:boardId` returns a board and its tasks.
- `PATCH /boards/:boardId/columns` updates custom statuses and WIP limits.

## Tasks

- `GET /tasks?workspaceId=&boardId=&status=` lists tasks.
- `POST /tasks` creates a task with labels, priority, due date, assignees, and story points.
- `PATCH /tasks/:taskId` updates task fields, rich text, subtasks, dependencies, and recurring rules.
- `PATCH /tasks/:taskId/move` moves a task between statuses and emits realtime events.
- `POST /tasks/:taskId/comments` adds a comment, creates mention notifications, and emits realtime events.
- `POST /tasks/:taskId/archive` archives a task.

## Pomodoro

- `POST /pomodoro/sessions` stores a focus session and updates productivity stats.
- `GET /pomodoro/sessions?workspaceId=&userId=` lists focus history.
- `GET /pomodoro/leaderboard?workspaceId=` returns focus leaderboard data.

## Analytics

- `GET /analytics/overview?workspaceId=` returns completed tasks, active tasks, focus minutes, and focus score.
- `GET /analytics/series?workspaceId=` returns analytics records.
- `POST /analytics/rollup` queues an analytics rollup job.

## AI

- `POST /ai/task-generation` creates structured task drafts from a prompt.
- `POST /ai/sprint-plan` recommends sprint scope from backlog and capacity.
- `POST /ai/summaries` summarizes selected tasks.
- `POST /ai/prioritize` ranks tasks by priority signals.

## Collaboration

- `GET /notifications` lists notifications.
- `PATCH /notifications/:notificationId/read` marks a notification read.
- `POST /notifications/read-all` marks all notifications read.
- `GET /search?q=&workspaceId=` searches tasks and boards with cached AI-style suggestions.
- `POST /uploads/signature` creates a Cloudinary signed upload payload.
- `POST /uploads` uploads a file or voice note through the API.
- `GET /calendar/agenda?workspaceId=` returns task-derived calendar events.
- `POST /calendar/google/connect` returns the Google sync handoff placeholder.
- `GET /team/:workspaceId/members` lists workspace members.
- `GET /team/:workspaceId/workload` returns team workload and focus aggregates.

## Socket.io Events

- Client emits `workspace:join` with `{ workspaceId, userId, name }`.
- Server emits `presence:update`.
- Client emits `presence:focus`.
- Client/server emit `task:created`, `task:updated`, `task:moved`, `task:archived`.
- Client/server emit `comment:typing`, `comment:created`.
- Client/server emit `notification:new`.
