type GuestPayload = { message?: string } | undefined;
type Listener = (payload: GuestPayload) => void;

const listeners = new Set<Listener>();

/**
 * http.ts lives outside React and can't call useAuthContext directly.
 * When it sees a 403, it emits a "guest" event here; AuthProvider
 * subscribes to it and flips global auth state to guest mode.
 */
const authEvents = {
  onGuest: (cb: Listener): (() => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  emitGuest: (payload?: GuestPayload): void => {
    listeners.forEach((cb) => cb(payload));
  },
};

export default authEvents;