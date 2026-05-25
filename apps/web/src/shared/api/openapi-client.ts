import createClient, { type Middleware } from 'openapi-fetch';
import {
  clearSessionFromBridge,
  getAccessTokenFromBridge,
  getLoginRoute,
  tryRefreshFromBridge,
} from './auth-bridge';
import { API_BASE_URL } from '../config/env';
import { ApiError } from './errors';
import type { paths } from './generated/schema';

export const publicOpenApiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

export const openapiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

let isRefreshing: Promise<boolean> | null = null;

const authMiddleware: Middleware = {
  onRequest({ request }) {
    const accessToken = getAccessTokenFromBridge();
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return request;
  },
  async onResponse({ request, response }) {
    if (response.status !== 401 || typeof window === 'undefined') {
      return response;
    }
    if (!isRefreshing) {
      isRefreshing = tryRefreshFromBridge().finally(() => {
        isRefreshing = null;
      });
    }
    const refreshed = await isRefreshing;
    if (refreshed) {
      const newToken = getAccessTokenFromBridge();
      if (newToken) {
        request.headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(request);
      }
    }
    clearSessionFromBridge();
    const loginRoute = getLoginRoute();
    if (!window.location.pathname.startsWith(loginRoute)) {
      window.location.replace(loginRoute);
    }
    return response;
  },
};

openapiClient.use(authMiddleware);

type OpenApiFetchResult<T> = {
  readonly data?: T;
  readonly error?: unknown;
  readonly response: Response;
};

export async function executeOpenApiRequest<T>(result: OpenApiFetchResult<T>): Promise<T> {
  const { data, error, response } = result;
  if (error !== undefined && error !== null) {
    throw new ApiError(response.status, parseOpenApiErrorMessage(error));
  }
  if (response.status === 204) {
    return undefined as T;
  }
  if (data === undefined) {
    throw new ApiError(response.status, response.statusText || 'Request failed');
  }
  return data;
}

function parseOpenApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: string | string[] }).message;
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'Request failed';
}
