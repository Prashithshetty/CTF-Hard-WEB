// Proton Dynamics — Configuration Backup
// Internal system configuration backup and environment snapshots.


module.exports = (req, res) => {
  // Make it look like an accidentally exposed backup file
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('X-Proton-Warning', 'This endpoint is deprecated and scheduled for removal');

  res.status(200).send(`# Proton Dynamics — Environment Configuration Backup
# Generated: 2024-09-15T14:32:07Z
# Server: proton-web-07.internal.protondynamics.io
# WARNING: This file contains sensitive credentials. Do NOT commit to VCS.
# Contact: j.kimura@protondynamics.io

# ===== Database Configuration =====
DB_HOST=proton-db-07.internal.protondynamics.io
DB_PORT=5432
DB_NAME=proton_research_v3
DB_USER=proton_admin
DB_PASS=Pr0t0n_Adm1n_2024!#@CHANGEME
DB_SSL=true
DB_POOL_SIZE=50

# ===== Redis Cache =====
REDIS_URL=redis://proton-cache-03.internal:6379
REDIS_PASSWORD=pr0t0n_c4ch3_s3cr3t

# ===== Authentication =====
JWT_SECRET=proton_jwt_s3cr3t_k3y_2024_NOT_REAL
JWT_EXPIRY=3600
SESSION_SECRET=pr0t0n_s3ss10n_k3y_v2
ADMIN_API_KEY=prt-admin-7f4a8b2c-9e1d-3f5a-6b7c-8d9e0f1a2b3c

# ===== Proton Core API =====
PROTON_CORE_URL=https://core.protondynamics.internal:8443
PROTON_CORE_API_KEY=prt_core_ak_b1c2d3e4f5a6b7c8d9e0f1a2
PROTON_TELEMETRY_WS=wss://telemetry.protondynamics.internal:8443

# ===== External Services =====
SENDGRID_API_KEY=SG.fake0key0here0000000000.0000000000000000000000000000000
SENTRY_DSN=https://fake0000@o000000.ingest.sentry.io/0000000
DATADOG_API_KEY=fake00000000000000000000000000000

# ===== Feature Flags =====
ENABLE_DEBUG_MODE=false
ENABLE_GRAPHQL_INTROSPECTION=true
ENABLE_LEGACY_AUTH=true
ENABLE_EVENT_HORIZON=false

# ===== CTF Configuration =====
# Flag is NOT stored here. Nice try.
# CTF_FLAG=HACKFAST{3nv_f1l3s_4r3_t00_0bv10us}
# Real flag location: Check the Proton Vault at /api/secret
# Access requires admin JWT — generate via /api/login with admin creds
`);
};
