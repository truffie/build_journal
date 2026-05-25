import type { DatabaseConfig } from '../config/database-config.type';

const ALLOW_PUBLIC_KEY_RETRIEVAL = 'allowPublicKeyRetrieval';
const CONNECTION_LIMIT = 'connectionLimit';

/**
 * Builds a mariadb connection URL for PrismaMariaDb (MySQL 8 caching_sha2_password in Docker).
 */
export function buildMariaDbAdapterConfig(config: DatabaseConfig): string {
  const user = encodeURIComponent(config.user);
  const password = encodeURIComponent(config.password);
  const url = new URL(`mysql://${user}:${password}@${config.host}:${config.port}/${config.database}`);
  url.searchParams.set(ALLOW_PUBLIC_KEY_RETRIEVAL, 'true');
  url.searchParams.set(CONNECTION_LIMIT, String(config.connectionLimit));
  return url.toString();
}
