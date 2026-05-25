import { API_BASE_URL } from '@/shared/config/env';

export async function logoutRequest(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
