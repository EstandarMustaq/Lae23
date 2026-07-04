# Ponte Segura Architecture

## Summary

Ponte Segura starts as a modular monolith that can run as one community node. Each node owns its PostgreSQL database and records domain changes as events through a transactional outbox.

## Modules

- `incidents`: flooded areas, isolated persons and blocked infrastructure.
- `help-requests`: needs such as water, food, medicine, shelter and evacuation.
- `resources`: donor offers.
- `volunteers`: available people, skills and transport.
- `matching`: transparent scoring rules.
- `missions`: coordinated response plans.
- `federation`: node handshake and event exchange contracts.

## Event Model

Every relevant state change is stored as an event envelope:

```ts
type DomainEventEnvelope = {
  eventId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  originNodeId: string;
  occurredAt: string;
  schemaVersion: number;
  payload: unknown;
};
```

API operations write the aggregate row and the outbox event in the same database transaction.

`outbox_events` stores complete federation envelopes:

```text
eventId
eventType
aggregateType
aggregateId
originNodeId
occurredAt
schemaVersion
payload
```

`inbox_events` stores remote envelopes for idempotent ingestion. The unique rule is `eventId + originNodeId`.

`outbox_event_deliveries` stores delivery state per peer:

```text
outboxEventId
peerNodeId
status
attemptCount
lastError
nextAttemptAt
deliveredAt
```

## Matching V1

Matching is rule-based:

```text
urgency + distance + resource compatibility + availability + capacity + trust
```

This keeps prioritization explainable during emergency operations.

## Federation V1

The first version exposes:

```text
POST /api/federation/handshake
GET  /api/federation/nodes
GET  /api/federation/events?limit=100&after=2026-07-04T00:00:00.000Z
GET  /api/federation/deliveries
POST /api/federation/events
```

Received events are stored in `inbox_events` for idempotency and applied to local domain tables in the same transaction. Events received from peers are not re-emitted to the outbox.

Handshake stores the peer node and appends `NODE_HANDSHAKE_COMPLETED` to the local outbox.

The worker sends outbox events to each peer using:

```text
POST {peer.baseUrl}/api/federation/events
```

Delivery is at-least-once. Application is idempotent through `inbox_events`.

## Local Docker Note

If Docker fails with a `runc/seccomp` error while starting containers, the issue is local runtime configuration. The application can still be validated with:

```bash
env COREPACK_HOME=/tmp/corepack corepack pnpm -r build
env COREPACK_HOME=/tmp/corepack corepack pnpm -r test
env COREPACK_HOME=/tmp/corepack corepack pnpm -r typecheck
```
