CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  base_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  phone VARCHAR(40),
  role VARCHAR(40) NOT NULL DEFAULT 'PUBLIC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  reporter_id UUID,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  urgency VARCHAR(30) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS persons (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  approximate_age INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS help_requests (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  reporter_id UUID,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  urgency VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS help_request_needs (
  id UUID PRIMARY KEY,
  help_request_id UUID NOT NULL,
  need_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_offers (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  donor_id UUID,
  resource_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  available_now BOOLEAN NOT NULL DEFAULT true,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  user_id UUID,
  display_name VARCHAR(120) NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  maximum_distance_km INTEGER NOT NULL DEFAULT 20,
  available_now BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_capabilities (
  id UUID PRIMARY KEY,
  volunteer_id UUID NOT NULL,
  capability_type VARCHAR(50) NOT NULL,
  value VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  help_request_id UUID NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mission_assignments (
  id UUID PRIMARY KEY,
  mission_id UUID NOT NULL,
  assignee_type VARCHAR(30) NOT NULL,
  assignee_id UUID NOT NULL,
  need_type VARCHAR(50),
  status VARCHAR(30) NOT NULL DEFAULT 'PROPOSED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY,
  origin_node_id UUID NOT NULL,
  label VARCHAR(150) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outbox_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(80) NOT NULL,
  aggregate_type VARCHAR(80) NOT NULL,
  aggregate_id UUID NOT NULL,
  origin_node_id UUID NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  synchronized_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outbox_event_deliveries (
  id UUID PRIMARY KEY,
  outbox_event_id UUID NOT NULL,
  peer_node_id UUID NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS outbox_event_deliveries_event_peer_unique
  ON outbox_event_deliveries (outbox_event_id, peer_node_id);

CREATE TABLE IF NOT EXISTS inbox_events (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  event_type VARCHAR(80) NOT NULL,
  origin_node_id UUID NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS inbox_events_event_origin_unique
  ON inbox_events (event_id, origin_node_id);

CREATE TABLE IF NOT EXISTS sync_peers (
  id UUID PRIMARY KEY,
  node_id UUID NOT NULL,
  name VARCHAR(120) NOT NULL,
  base_url TEXT NOT NULL,
  last_handshake_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS sync_peers_node_id_unique
  ON sync_peers (node_id);
