import { newCharacter, parseCharacter, type Character } from './index';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sotdl-character', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Feche outras abas para atualizar o armazenamento.'));
  });
}
export async function loadCharacter(): Promise<Character> {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('state', 'readonly'), request = tx.objectStore('state').get('character');
      tx.oncomplete = () => { try { resolve(request.result === undefined ? newCharacter() : parseCharacter(request.result)); } catch (e) { reject(e); } };
      tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
    });
  } finally { db.close(); }
}
export async function clearCharacter(): Promise<void> {
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('state', 'readwrite');
      tx.objectStore('state').delete('character');
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new Error('Gravação cancelada.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}
export async function saveCharacter(character: Character, expected: Character): Promise<void> {
  const validated = parseCharacter(character), db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('state', 'readwrite'), store = tx.objectStore('state');
      const request = store.get('character');
      let failure: Error | undefined;
      request.onsuccess = () => {
        try {
          const previous = request.result === undefined ? newCharacter() : parseCharacter(request.result);
          if (JSON.stringify(previous) !== JSON.stringify(parseCharacter(expected))) throw new Error('Ficha alterada em outra aba. Recarregue antes de salvar.');
          store.put(validated, 'character');
        } catch (e) { failure = e instanceof Error ? e : new Error(String(e)); tx.abort(); }
      };
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(failure ?? tx.error ?? new Error('Gravação cancelada.'));
      tx.onerror = () => reject(tx.error);
    });
  } finally { db.close(); }
}
