/**
 * Not cryptographically random on purpose — this only needs to be unique
 * among a user's own groups in localStorage, not globally unique or
 * unguessable. Avoids relying on crypto.randomUUID(), which isn't reliably
 * present across every test/browser environment this app runs in.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
