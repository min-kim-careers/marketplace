# Marketplace API

The FastAPI backend for the [PC Parts Marketplace](../marketplace). See that repo for the demo and the architecture.

- Separate modules for `auth`, `item`, `profile` and `chat`
- Firebase ID tokens verified with firebase-admin
- PostgreSQL through SQLAlchemy, with Redis caching for frequent reads
- A WebSocket chat server (`app/chat/server/`) with a connection manager and a Redis-backed cache

**Stack:** FastAPI · SQLAlchemy · PostgreSQL · Redis · Firebase Admin · WebSockets

Run it through the [marketplace](../marketplace) repo's Docker Compose.
