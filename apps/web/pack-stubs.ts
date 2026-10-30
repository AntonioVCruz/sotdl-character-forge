/** Lê stubs de content-packs se o checkout os tiver. Ausência é lista vazia, não erro. */
export function loadStubModules(): unknown[] {
  const modules = import.meta.glob('../../content-packs/**/pack.json', { eager: true, import: 'default' }) as Record<string, unknown>;
  return Object.values(modules);
}
