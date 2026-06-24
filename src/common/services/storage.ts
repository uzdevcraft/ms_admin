// core/services/storage.ts
import store from 'store2';

const createStorage = (type: 'local' | 'session') => ({
  get: (key: string) => store[type].get(key),

  set: (key: string, value: any) => {
    store[type].set(key, value);

    // 🔔 LocalStorage o'zgarishini xabar beramiz
    const event = new CustomEvent('storage-changed', {
      detail: { key, value, type }
    });
    window.dispatchEvent(event);
  },

  remove: (key: string) => {
    store[type].remove(key);

    // 🔔 O'chirilganda ham xabar beramiz
    const event = new CustomEvent('storage-changed', {
      detail: { key, type }
    });
    window.dispatchEvent(event);
  }
});

const storage = {
  local: createStorage('local'),
  session: createStorage('session')
};

export default storage;
