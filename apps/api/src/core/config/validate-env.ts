const REQUIRED_STRING_KEYS = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_ROOT_PASSWORD',
  'MYSQL_DATABASE',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CORS_ORIGIN',
] as const;

/**
 * Validates required environment variables at application bootstrap.
 * @throws Error when a required variable is missing or invalid
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  for (const key of REQUIRED_STRING_KEYS) {
    const value = config[key];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
  const mysqlPortRaw = config.MYSQL_PORT;
  if (mysqlPortRaw === undefined || mysqlPortRaw === null || String(mysqlPortRaw).trim() === '') {
    throw new Error('Missing required environment variable: MYSQL_PORT');
  }
  const mysqlPort = Number(mysqlPortRaw);
  if (!Number.isFinite(mysqlPort) || mysqlPort <= 0) {
    throw new Error('MYSQL_PORT must be a positive number');
  }
  return config;
}
