# Deployment Guide

## Frontend on Vercel

1. Set the project root to `apps/web`.
2. Build command: `npm run build --workspace=@flowforge/web`.
3. Output is managed by Next.js.
4. Required env:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SOCKET_URL`

## Backend on Render, Railway, Fly, or AWS

1. Service root can remain repository root.
2. Build command: `npm install && npm run build --workspace=@flowforge/api`.
3. Start command: `npm run start --workspace=@flowforge/api`.
4. Required env:
   - `NODE_ENV=production`
   - `PORT`
   - `CLIENT_URL`
   - `MONGODB_URI`
   - `REDIS_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `COOKIE_DOMAIN`
   - Cloudinary, SMTP, OAuth, and AI keys as needed.

## Data Services

- MongoDB Atlas: create a cluster, add indexes from Mongoose, allow backend network access.
- Redis Cloud: use TLS URL if provider requires it and update `REDIS_URL`.
- Cloudinary: configure cloud name, key, and secret for uploads.

## Docker

Local full stack:

```bash
cp .env.example .env
docker compose up --build
```

The compose file starts:

- `web` on `3000`
- `api` on `4000`
- `mongo` on `27017`
- `redis` on `6379`

## Security Checklist

- Rotate JWT secrets before first deploy.
- Use HTTPS-only cookies in production.
- Set `CLIENT_URL` to the exact frontend origin.
- Configure OAuth callback URLs.
- Enable MongoDB Atlas backups and IP restrictions.
- Add SMTP provider for verification, reset, invite, and alert emails.
- Add Sentry or equivalent error monitoring.
- Add OpenTelemetry traces for API, MongoDB, Redis, queues, and Socket.io.
