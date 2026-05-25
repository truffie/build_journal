/**
 * Builds Prisma datasource URL from MYSQL_*.
 * Optional DATABASE_URL override (ignored when empty — Docker sets DATABASE_URL="" to use MYSQL_HOST=db).
 */
export function buildDatabaseUrlFromEnv(env: NodeJS.ProcessEnv = process.env): string {
  const direct = env.DATABASE_URL?.trim();
  if (direct) {
    return direct;
  }
  const host = env.MYSQL_HOST ?? 'localhost';
  const port = env.MYSQL_PORT ?? '3306';
  const user = encodeURIComponent(env.MYSQL_USER ?? 'root');
  const password = encodeURIComponent(env.MYSQL_ROOT_PASSWORD ?? '');
  const database = env.MYSQL_DATABASE ?? 'build_journal';
  return `mysql://${user}:${password}@${host}:${port}/${database}?allowPublicKeyRetrieval=true`;
}
