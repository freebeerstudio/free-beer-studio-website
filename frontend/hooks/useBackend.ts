import backend from '~backend/client';

export function useBackend() {
  // For now, return the basic backend client
  // TODO: Add proper authentication integration
  return backend;
}
