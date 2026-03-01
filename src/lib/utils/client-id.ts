// Generate or retrieve a guest client ID from localStorage
export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'vivivi.clientId';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
