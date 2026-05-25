import { API_BASE_URL } from '@/shared/config/env';
import type { AuthUser } from '../model/session.types';

type RefreshResponse = {
  readonly accessToken: string;
  readonly user: AuthUser;
};

export async function refreshRequest(): Promise<RefreshResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as RefreshResponse;
  } catch {
    return null;
  }
}
