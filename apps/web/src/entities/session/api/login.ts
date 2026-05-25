import { ApiError } from '@/shared/api/errors';
import { API_BASE_URL } from '@/shared/config/env';
import type { AuthUser } from '../model/session.types';

type LoginPayload = {
  readonly email: string;
  readonly password: string;
};

type LoginResponse = {
  readonly accessToken: string;
  readonly user: AuthUser;
};

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string | string[] };
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message ?? 'Login failed';
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as LoginResponse;
}
