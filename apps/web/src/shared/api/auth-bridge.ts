const LOGIN_ROUTE = '/login';

type AuthApiBridge = {
  getAccessToken: () => string | null;
  clearSession: () => void;
  tryRefresh: () => Promise<boolean>;
};

let bridge: AuthApiBridge = {
  getAccessToken: () => null,
  clearSession: () => undefined,
  tryRefresh: () => Promise.resolve(false),
};

export function registerAuthApiBridge(nextBridge: AuthApiBridge): void {
  bridge = nextBridge;
}

export function getAccessTokenFromBridge(): string | null {
  return bridge.getAccessToken();
}

export function clearSessionFromBridge(): void {
  bridge.clearSession();
}

export function tryRefreshFromBridge(): Promise<boolean> {
  return bridge.tryRefresh();
}

export function getLoginRoute(): string {
  return LOGIN_ROUTE;
}
