# Ponte Segura

Ponte Segura is a community node platform for flood response coordination. The initial implementation is a modular TypeScript monorepo with NestJS, PostgreSQL, Drizzle ORM, domain events and a transactional outbox.

## Stack

- NestJS API
- PostgreSQL
- Drizzle ORM
- TypeScript packages for contracts, domain, database and events
- Worker process for automatic peer federation
- Docker Compose for a local node

## Local Development

```bash
pnpm install
pnpm build
pnpm test
```

Run a local node:

```bash
docker compose -f infrastructure/compose/docker-compose.yml up --build
```

API:

```text
http://localhost:3000/api
http://localhost:3000/api/docs
```

## Core Flow

```text
Help request created
  -> outbox event persisted
  -> resource offers and volunteers registered
  -> matching ranks compatible candidates
  -> mission created with assignments
  -> worker delivers outbox events to peers
  -> peers ingest events into inbox and apply them locally
```

The first version supports federation with typed event contracts, `inbox_events`, `outbox_events`, per-peer delivery tracking and `/api/federation/*` endpoints.

## Federation Boundary

Federation V1 supports:

```text
POST /api/federation/handshake
GET  /api/federation/nodes
GET  /api/federation/events?limit=100&after=2026-07-04T00:00:00.000Z
GET  /api/federation/deliveries
POST /api/federation/events
```

Received events are stored in `inbox_events` with idempotency by `eventId + originNodeId` and applied to local domain tables in the same transaction. Incoming remote events do not create new outbox events.

Local domain changes are written to `outbox_events` through the transactional outbox pattern. The worker creates `outbox_event_deliveries` for each peer, sends events by HTTP and marks `synchronizedAt` after all known peers receive the event.
