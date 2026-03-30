# 🐳 Docker.md — Phase 2 Deployment Specification

> **Version:** 1.0.0 | **Project:** Namka Control Dashboard
> **Author:** Comet (Auditor) | **Date:** 2026-03-30
> **Status:** 🟡 Pending Claude Ratification

---

## 🎯 Purpose of This Document

This document is the **technical ground truth** for Phase 2 deployment. It contains the finalized architecture, all confirmed infrastructure details, and the exact file specifications for AG to implement.

**Claude:** Your task is to review this document, validate all decisions against the MACP protocol, and write `AG-Update.md` if you issue a Green Light. This document must not be edited by AG — it is a read-only spec.

---

## ✅ Pre-Flight Checklist (All Confirmed)

| Item | Detail | Status |
|---|---|---|
| DNS A-Record | `control` → `147.93.18.188` (TTL: 300s) | ✅ Confirmed |
| VPS Plan | KVM 2 — 8 GB RAM, 2 vCPU, 100 GB Disk | ✅ Confirmed |
| VPS RAM at idle | 36% used (~2.9 GB) — ~5 GB free | ✅ Confirmed |
| OS | Ubuntu 24.04 with Docker pre-installed | ✅ Confirmed |
| Docker installed | Pre-installed by Hostinger | ✅ Confirmed |
| VPS IP | `147.93.18.188` | ✅ Confirmed |
| Target subdomain | `control.namka.cloud` | ✅ Confirmed |
| SSH username | `root` | ✅ Confirmed |

---

## 🏗️ Architecture Overview

### Deployment Stack

```
Internet
    │
    ▼
[Nginx Reverse Proxy]   ← control.namka.cloud:443 (SSL via Certbot)
    │
    ▼
[Docker Container]      ← namka-control app on port 3000
    │
    ▼
[Next.js 15 Standalone] ← node:20-alpine, output: 'standalone'
    │
    ├── GitHub REST API ← fetches Master.md + Active-Projects.md
    └── Gemini API      ← AI layer via /api/ai Route Handler
```

### Key Design Decisions

| Component | Choice | Rationale |
|---|---|---|
| Base Image | `node:20-alpine` | Minimal footprint, ~200MB final image |
| Next.js Build Mode | `output: 'standalone'` | Only ships necessary node_modules to production |
| Orchestration | Docker Compose | Clean env var management + named network |
| Networking | External `web_network` | Allows Nginx to route to container without port exposure |
| Secrets | Host env vars (not `.env` file) | Prevents credential leakage into image layers |
| SSL | Certbot / Let's Encrypt | Free, auto-renews, subdomain support |

---

## 📁 Files for AG to Create

### 1. `Dockerfile`

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

### 2. `docker-compose.yml`

```yaml
version: '3.8'

services:
  namka-control:
    build: .
    container_name: namka-control
    restart: unless-stopped
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXT_TELEMETRY_DISABLED=1
      - NODE_ENV=production
    networks:
      - web_network

networks:
  web_network:
    external: true
```

> **Note for AG:** The `web_network` must be created on the VPS before running compose:
> `docker network create web_network`

---

### 3. `.dockerignore`

```
.env
.env.local
.env.*.local
node_modules
.next
.git
.gitignore
*.md
README.md
.github
```

---

### 4. `nginx/control.namka.cloud.conf`

```nginx
server {
    listen 80;
    server_name control.namka.cloud;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name control.namka.cloud;

    ssl_certificate /etc/letsencrypt/live/control.namka.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/control.namka.cloud/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://namka-control:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> **Note for AG:** Place this file in `/etc/nginx/sites-available/` and symlink to `/etc/nginx/sites-enabled/`.
> Run `nginx -t` before reloading. Certbot will auto-modify this file on first SSL install.

---

### 5. `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js app
        run: npm run build
        env:
          NEXT_TELEMETRY_DISABLED: 1

      - name: Deploy to VPS via SSH
        if: success()
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/namka-control
            git pull origin main
            docker compose down
            docker compose build --no-cache
            docker compose up -d
            docker system prune -f
```

> **Critical:** The `if: success()` guard on the deploy step ensures a failed `npm run build` will **never** trigger SSH deployment.

---

### 6. `next.config.ts` — Confirm `standalone` is set

AG must verify `next.config.ts` contains `output: 'standalone'`. Current file content must be checked. If missing, add it:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

---

## 🔐 Environment Variables

### On the VPS (set in `/etc/environment` or as shell exports before running compose)

```bash
export GITHUB_TOKEN="your_github_token_here"
export GEMINI_API_KEY="your_gemini_api_key_here"
```

### In GitHub Actions Secrets (Settings → Secrets → Actions)

| Secret Name | Value |
|---|---|
| `VPS_HOST` | `147.93.18.188` |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Private SSH key (AG generates keypair, adds public key to VPS authorized_keys) |

---

## 🚀 AG Execution Order

AG must follow these steps **in exact sequence**:

1. **Verify `next.config.ts`** — confirm or add `output: 'standalone'`
2. **Create `Dockerfile`** at repo root
3. **Create `docker-compose.yml`** at repo root
4. **Create `.dockerignore`** at repo root
5. **Create `nginx/control.namka.cloud.conf`** in repo (for reference — AG manually places on VPS)
6. **Create `.github/workflows/deploy.yml`**
7. **Add GitHub Actions secrets** (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) via repo Settings
8. **SSH into VPS and run:**
   ```bash
   docker network create web_network
   mkdir -p /var/www/namka-control
   cd /var/www/namka-control
   git clone https://github.com/AliMora83/namka-control.git .
   ```
9. **Set env vars on VPS**, then run:
   ```bash
   docker compose build
   docker compose up -d
   ```
10. **Configure Nginx** — place config, symlink, test, reload
11. **Run Certbot:**
    ```bash
    certbot --nginx -d control.namka.cloud
    ```
12. **Verify** — visit `https://control.namka.cloud` and confirm the dashboard loads

---

## 🧐 Comet Audit Notes (For Claude's Reference)

- **No `mem_limit` needed** — VPS has 8 GB RAM, container will use ~200-300 MB max
- **Alpine is correct** — `node:20-alpine` is compatible with Next.js 15 standalone mode
- **`unless-stopped` restart policy** is correct for a production VPS — container survives reboots
- **`docker system prune -f`** in deploy script removes dangling images to prevent disk buildup over time
- **Nginx proxies to container by name** (`namka-control:3000`) not by IP — this works because both are on the same `web_network`
- **Certbot must run AFTER Nginx is serving HTTP** on port 80 — it uses the HTTP-01 challenge

---

## 🟡 Claude Ratification Request

**Claude, please review and respond with one of:**

- ✅ **GREEN LIGHT** — Proceed. Write `AG-Update.md` with these exact specs.
- 🟡 **CONDITIONAL** — Green light with amendments listed below.
- 🔴 **HOLD** — Specific blocker identified. Do not proceed until resolved.

**Focus areas for Claude's UX/Product review:**
1. Does the GitHub Actions workflow meet CI/CD safety standards (build-before-deploy)?
2. Is the Cached Mode for `/api/master` (stale-while-revalidate) needed before go-live, or can it be Phase 3?
3. Any UX risk in the current deployment approach that could result in downtime during `docker compose down`?

---

*This document was authored by Comet (Auditor) following Gemini's Docker proposal and Ali's infrastructure confirmation.*
*Next action: Claude ratification → AG-Update.md → AG executes.*
