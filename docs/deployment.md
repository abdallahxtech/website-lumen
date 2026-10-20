# Deployment

The current hosting of lumenrealty.ae was not available to inspect. Nothing has been deployed and DNS has not been touched. The app is host-agnostic; pick one of the options below once hosting is confirmed.

## Requirements

- Node.js 20.9+ (22 LTS recommended), or Docker.
- **A persistent volume for `LEADS_DB_PATH`.** Serverless hosts with ephemeral disks (for example Vercel functions) cannot keep the SQLite file. On those hosts, set `CRM_PROVIDER` so the CRM is the system of record, or swap the store for a managed database.
- HTTPS termination (a reverse proxy or platform TLS).

## Option A — Docker (any VPS, EasyPanel, Coolify, Portainer)

```bash
docker build -t lumen-web:$(git rev-parse --short HEAD) .
docker run -d --name lumen-web -p 3000:3000 \
  -v lumen-data:/data \
  --env-file .env.production \
  lumen-web:<tag>
```

Point the reverse proxy (Caddy, Nginx, Traefik) at port 3000 for `lumenrealty.ae` and `www.lumenrealty.ae`, and redirect `www` to the apex (or the other way round, but pick one).

## Option B — Node directly

```bash
npm ci && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone && PORT=3000 node server.js
```

Run it under a process manager (systemd or pm2) with the environment variables from `.env.example`.

## Release procedure

1. Back up the current live site (files and any form data) and record its version.
2. Deploy to **staging** with `NEXT_PUBLIC_ALLOW_INDEXING=false`.
3. Run `npm test` and `npm run test:e2e` in CI or locally; both must pass.
4. On staging: submit one enquiry from every form type and confirm it appears in `/admin/leads` and, if configured, in the CRM.
5. Check `/sitemap.xml`, `/robots.txt`, social previews (paste the URL into WhatsApp and LinkedIn) and SSL.
6. Work through [launch-checklist.md](launch-checklist.md) and obtain written approval.
7. Deploy to production with `NEXT_PUBLIC_ALLOW_INDEXING=true`, then submit the sitemap in Google Search Console.

## Rollback

- **Docker:** `docker stop lumen-web && docker run … lumen-web:<previous-tag>`. The `/data` volume persists across versions, so leads are kept.
- **Node:** keep the previous build directory and switch the process back to it.
- **Code:** the initial scaffold commit on `feature/premium-rebuild` is the baseline. `git revert` any release commit rather than force-pushing.
- **Data:** back up the SQLite file with `sqlite3 /data/leads.db ".backup /backups/leads-$(date +%F).db"` before every release; it is safe while the app is running.

## Redirects

If the old site used different URLs (for example `/about-us` or `/listings`), add them to `next.config.ts` under `async redirects()` with `permanent: true` before launch, so existing search rankings carry over.
