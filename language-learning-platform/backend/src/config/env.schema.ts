// Note: Joi validation can be added if needed
// For now, using basic validation

export const config = () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'llp_user',
    password: process.env.DB_PASSWORD || 'llp_password',
    database: process.env.DB_NAME || 'llp_db',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  magicLink: {
    secret: process.env.MAGIC_LINK_SECRET || 'change-me-in-production',
    expiresIn: process.env.MAGIC_LINK_EXPIRES_IN || '15m',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  vectorSearch: {
    enabled: process.env.VECTOR_SEARCH_ENABLED === 'true',
    provider: process.env.VECTOR_SEARCH_PROVIDER || 'pgvector',
  },
  compliance: {
    embedWhitelist: (process.env.EMBED_WHITELIST || 'youtube.com,vimeo.com').split(','),
    auditEnabled: process.env.COMPLIANCE_AUDIT_ENABLED !== 'false',
  },
  schema: undefined, // Joi schema can be added if validation is needed
});
