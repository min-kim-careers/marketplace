# PC Parts Marketplace

A marketplace for Australians to buy and sell used PC components, with image-first listings, fast search and real-time buyer–seller chat.

Status: **Not currently hosted**

## Why
General marketplaces bury PC parts among everything else and don't show the details that matter, such as specs, condition and photos. This one is built just for PC hardware.

## Architecture
```
Browser ─▶ nginx gateway ─┬─▶ marketplace-web (Next.js)
                          └─▶ marketplace-api (FastAPI) ─┬─▶ PostgreSQL
                                 └─ /chat/ws (WebSocket) └─▶ Redis (cache)
```
| Service | Repo | Stack |
|---|---|---|
| Web | [marketplace-web](https://github.com/min-kim-careers/marketplace-web) | Next.js 15, React, Zustand, Tailwind |
| API + chat | [marketplace-api](https://github.com/min-kim-careers/marketplace-api) | FastAPI, SQLAlchemy, PostgreSQL, Redis |

This repo holds both services (`api/` and `web/`), along with the Docker Compose files and the nginx gateway config.

## Key design decisions
| Decision | Why | Trade-off |
|---|---|---|
| Firebase Auth, with tokens checked on the server | Ready-made Google sign-in, and the API still enforces access | Tied to Firebase |
| Chat inside the API service | One deployment, with auth shared with the rest of the API | Chat and the API scale together |
| Self-hosted behind Cloudflare Tunnel | No exposed ports and no cloud bill | Uptime depends on my own server |

## Stack
Next.js · FastAPI · PostgreSQL · Redis · Firebase Auth · Cloudflare Turnstile · Docker Compose · nginx · Cloudflare Tunnel

## Running it
Runs on Docker Compose: the Next.js web app, the FastAPI API with WebSocket chat, PostgreSQL, Redis and an nginx gateway, with Firebase Auth and Cloudflare Turnstile. See `compose.dev.yml` for the full setup.

## What I'd improve next
- Full-text search with ranking (Postgres `tsvector`)
- Image resizing and CDN delivery
