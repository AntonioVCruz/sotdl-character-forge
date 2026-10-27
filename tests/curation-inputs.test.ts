import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, basename, resolve } from 'node:path';
// @ts-expect-error Local Node-only CLI module; its output contract is frozen in CUR-007.
import { collectInputs, manifestChanges, linesOf } from '../tools/curation/inputs.mjs';
async function removeTemp(root: string) {
  if (dirname(resolve(root)) !== resolve(tmpdir()) || !basename(root).startsWith('sotdl-curation-')) throw new Error('Diretório temporário inesperado.');
  await rm(root, { recursive: true, force: true });
}

describe('manifesto reproduzível de insumos', () => {
  it('detecta alteração de bytes, adição e remoção sem modificar originais', async () => {
    const root = await mkdtemp(join(tmpdir(), 'sotdl-curation-'));
    try {
      await mkdir(join(root,'rules')); await writeFile(join(root,'rules/a.md'),'# A\r\ntexto\r\n');
      const first = await collectInputs(root,'2026-10-26','fixed-tool-hash');
      expect(await collectInputs(root,'2026-10-26','fixed-tool-hash')).toEqual(first);
      expect(first.files[0]).toMatchObject({ lines: 2, encoding: 'utf-8', lineEndings: { crlf: 2, lf: 0, cr: 0 } });
      await writeFile(join(root,'rules/a.md'),'# A\r\ntexto modificado\r\n');
      expect(manifestChanges(first, await collectInputs(root,'2026-10-26','fixed-tool-hash'))).toEqual(['rules/a.md: alterado']);
      await rm(join(root,'rules/a.md')); await writeFile(join(root,'rules/b.md'),'# B');
      expect(manifestChanges(first, await collectInputs(root,'2026-10-26','fixed-tool-hash'))).toEqual(['rules/b.md: adicionado','rules/a.md: removido']);
    } finally { await removeTemp(root); }
  });
  it('distingue BOM, finais de linha e erro de encoding', async () => {
    expect(linesOf('a\nb\n')).toEqual(['a','b']); expect(linesOf('')).toEqual([]);
    const root = await mkdtemp(join(tmpdir(), 'sotdl-curation-'));
    try {
      await mkdir(join(root,'rules')); await writeFile(join(root,'rules/a.md'),Buffer.from([239,187,191,...Buffer.from('# A\n')]));
      expect((await collectInputs(root,'2026-10-26','fixed')).files[0]).toMatchObject({ bom: true, title: '# A', lines: 1 });
      await writeFile(join(root,'rules/a.md'),Buffer.from([255]));
      await expect(collectInputs(root,'2026-10-26','fixed')).rejects.toThrow();
    } finally { await removeTemp(root); }
  });
});
