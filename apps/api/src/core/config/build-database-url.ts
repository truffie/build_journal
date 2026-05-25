/**
 * Builds Prisma datasource URL from MYSQL_* (DATABASE_URL overrides when set).
 */
export function buildDatabaseUrlFromEnv(env: NodeJS.ProcessEnv = process.env): string {
  const direct = env.DATABASE_URL?.trim();
  if (direct !== undefined && direct !== '') {
    return direct;
  }
  const host = env.MYSQL_HOST ?? 'localhost';
  const port = env.MYSQL_PORT ?? '3306';
  const user = encodeURIComponent(env.MYSQL_USER ?? 'root');
  const password = encodeURIComponent(env.MYSQL_ROOT_PASSWORD ?? '');
  const database = env.MYSQL_DATABASE ?? 'build_journal';
  return `mysql://${user}:${password}@${host}:${port}/${database}?allowPublicKeyRetrieval=true`;
}
