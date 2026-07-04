import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const nodes = pgTable("nodes", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  baseUrl: text("base_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  role: varchar("role", { length: 40 }).notNull().default("PUBLIC"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const incidents = pgTable("incidents", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  reporterId: uuid("reporter_id"),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  urgency: varchar("urgency", { length: 30 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const persons = pgTable("persons", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  approximateAge: integer("approximate_age"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const helpRequests = pgTable("help_requests", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  reporterId: uuid("reporter_id"),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  urgency: varchar("urgency", { length: 30 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("OPEN"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const helpRequestNeeds = pgTable("help_request_needs", {
  id: uuid("id").primaryKey(),
  helpRequestId: uuid("help_request_id").notNull(),
  needType: varchar("need_type", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  status: varchar("status", { length: 30 }).notNull().default("OPEN"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const resourceOffers = pgTable("resource_offers", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  donorId: uuid("donor_id"),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  availableNow: boolean("available_now").notNull().default(true),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const volunteers = pgTable("volunteers", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  userId: uuid("user_id"),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  skills: jsonb("skills").$type<string[]>().notNull().default([]),
  resources: jsonb("resources").$type<string[]>().notNull().default([]),
  maximumDistanceKm: integer("maximum_distance_km").notNull().default(20),
  availableNow: boolean("available_now").notNull().default(true),
  verified: boolean("verified").notNull().default(false),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const volunteerCapabilities = pgTable("volunteer_capabilities", {
  id: uuid("id").primaryKey(),
  volunteerId: uuid("volunteer_id").notNull(),
  capabilityType: varchar("capability_type", { length: 50 }).notNull(),
  value: varchar("value", { length: 80 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const missions = pgTable("missions", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  helpRequestId: uuid("help_request_id").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const missionAssignments = pgTable("mission_assignments", {
  id: uuid("id").primaryKey(),
  missionId: uuid("mission_id").notNull(),
  assigneeType: varchar("assignee_type", { length: 30 }).notNull(),
  assigneeId: uuid("assignee_id").notNull(),
  needType: varchar("need_type", { length: 50 }),
  status: varchar("status", { length: 30 }).notNull().default("PROPOSED"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey(),
  originNodeId: uuid("origin_node_id").notNull(),
  label: varchar("label", { length: 150 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const outboxEvents = pgTable("outbox_events", {
  id: uuid("id").primaryKey(),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  aggregateType: varchar("aggregate_type", { length: 80 }).notNull(),
  aggregateId: uuid("aggregate_id").notNull(),
  originNodeId: uuid("origin_node_id").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
  payload: jsonb("payload").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  synchronizedAt: timestamp("synchronized_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const outboxEventDeliveries = pgTable(
  "outbox_event_deliveries",
  {
    id: uuid("id").primaryKey(),
    outboxEventId: uuid("outbox_event_id").notNull(),
    peerNodeId: uuid("peer_node_id").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("PENDING"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastError: text("last_error"),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    outboxPeerUnique: uniqueIndex("outbox_event_deliveries_event_peer_unique").on(
      table.outboxEventId,
      table.peerNodeId
    )
  })
);

export const inboxEvents = pgTable(
  "inbox_events",
  {
    id: uuid("id").primaryKey(),
    eventId: uuid("event_id").notNull(),
    eventType: varchar("event_type", { length: 80 }).notNull(),
    originNodeId: uuid("origin_node_id").notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    payload: jsonb("payload").notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true })
  },
  (table) => ({
    eventOriginUnique: uniqueIndex("inbox_events_event_origin_unique").on(
      table.eventId,
      table.originNodeId
    )
  })
);

export const syncPeers = pgTable("sync_peers", {
  id: uuid("id").primaryKey(),
  nodeId: uuid("node_id").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  baseUrl: text("base_url").notNull(),
  lastHandshakeAt: timestamp("last_handshake_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  nodeIdUnique: uniqueIndex("sync_peers_node_id_unique").on(table.nodeId)
}));
