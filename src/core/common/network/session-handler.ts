// Breaks the api-client → auth.state circular dependency.
// auth.state registers its actions here on init.
let _clearSession: (() => void) | null = null;
let _updateToken: ((token: string) => void) | null = null;

export function registerClearSession(fn: () => void) {
  _clearSession = fn;
}

export function clearSessionGlobal() {
  _clearSession?.();
}

export function registerUpdateToken(fn: (token: string) => void) {
  _updateToken = fn;
}

export function updateTokenGlobal(token: string) {
  _updateToken?.(token);
}
