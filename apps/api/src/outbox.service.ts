import { Injectable } from "@nestjs/common";
import {
  outboxEvents,
  type Database
} from "@ponte-segura/database";
import {
  createEventEnvelope,
  type DomainEventEnvelope,
  type DomainEventPayload,
  type DomainEventType
} from "@ponte-segura/events";
import { createId } from "@ponte-segura/shared";

type Transaction = Parameters<Parameters<Database["db"]["transaction"]>[0]>[0];

@Injectable()
export class OutboxService {
  createEnvelope<TEventType extends DomainEventType>(input: {
    eventType: TEventType;
    aggregateType: string;
    aggregateId: string;
    originNodeId: string;
    payload: DomainEventPayload<TEventType>;
  }): DomainEventEnvelope<DomainEventPayload<TEventType>> {
    return createEventEnvelope({
      eventId: createId(),
      eventType: input.eventType,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      originNodeId: input.originNodeId,
      payload: input.payload
    });
  }

  async append(tx: Transaction, envelope: DomainEventEnvelope): Promise<void> {
    await tx.insert(outboxEvents).values({
      id: envelope.eventId,
      eventType: envelope.eventType,
      aggregateType: envelope.aggregateType,
      aggregateId: envelope.aggregateId,
      originNodeId: envelope.originNodeId,
      schemaVersion: envelope.schemaVersion,
      payload: envelope.payload,
      occurredAt: new Date(envelope.occurredAt)
    });
  }
}
