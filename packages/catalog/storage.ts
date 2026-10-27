import { emptySnapshot, validateSnapshot, type Snapshot } from './index';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sotdl-catalog', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Feche outras abas para atualizar o armazenamento.'));
    request.onsuccess = () => resolve(request.result);
  });
}
export async function loadSnapshot(): Promise<Snapshot> {
  const db = await open();
  try {
    const value = await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction('state', 'readonly');
      const request = tx.objectStore('state').get('catalog');
      tx.oncomplete = () => resolve(request.result);
      tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    return value === undefined ? emptySnapshot() : validateSnapshot(value);
  } finally { db.close(); }
}
export async function saveSnapshot(snapshot: Snapshot): Promise<void> {
  const validated = validateSnapshot(snapshot);
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('state', 'readwrite');
      tx.objectStore('state').put(validated, 'catalog');
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new Error('Gravação cancelada.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}
