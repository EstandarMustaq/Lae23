import type { DomainEventType } from "./event-types.js";
import type { DomainEventPayload } from "./payloads.js";

export type DomainEventEnvelope<TPayload = unknown> = {
  eventId: string;
  eventType: DomainEventType;
  aggregateType: string;
  aggregateId: string;
  originNodeId: string;
  occurredAt: string;
  schemaVersion: number;
  payload: TPayload;
};

export type TypedDomainEventEnvelope<TEventType extends DomainEventType> =
  DomainEventEnvelope<DomainEventPayload<TEventType>> & {
    eventType: TEventType;
  };

export function createEventEnvelope<TEventType extends DomainEventType>(input: {
  eventId: string;
  eventType: TEventType;
  aggregateType: string;
  aggregateId: string;
  originNodeId: string;
  payload: DomainEventPayload<TEventType>;
  occurredAt?: Date;
  schemaVersion?: number;
}): TypedDomainEventEnvelope<TEventType> {
  return {
    eventId: input.eventId,
    eventType: input.eventType,
    aggregateType: input.aggregateType,
    aggregateId: input.aggregateId,
    originNodeId: input.originNodeId,
    occurredAt: (input.occurredAt ?? new Date()).toISOString(),
    schemaVersion: input.schemaVersion ?? 1,
    payload: input.payload
  };
}
