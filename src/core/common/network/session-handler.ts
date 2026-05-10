// Breaks the api-client → auth.state circular dependency.
// auth.state registers its clearSession action here on init.
let _clearSession: (() => void) | null = null;

export function registerClearSession(fn: () => void) {
  _clearSession = fn;
}

export function clearSessionGlobal() {
  _clearSession?.();
}
