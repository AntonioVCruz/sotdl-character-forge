import { describe, expect, it } from 'vitest';
import { redactBuyerLines, hasBuyerData, sanitizeArtifact, privacyHash, assertSafeArtifact } from '../tools/curation/privacy.mjs';
import { inspectContent, auditTracked } from '../tools/curation/privacy-check.mjs';
import { normalizeDocument, replayChanges } from '../tools/curation/editorial-normalizer';

const buyer = ['Synthetic Buyer', `(order #${['1234', '5678'].join('')})`].join(' ');

describe('curation privacy without licensed corpus', () => {
  it('redacts purchase lines in nested evidence and recomputes stored-text hashes without changing identity pins', () => {
    const text = `Damage 1d6\r\n${buyer}\r\nPrice 2 cp\n`;
    const record = { id: 'stable', inputSha256: privacyHash(text), originalText: text,
      evidence: [{ excerpt: text, excerptSha256: privacyHash(text) }], sections: [{ rawText: text, sha256: privacyHash(text) }] };
    const clean = sanitizeArtifact(record);
    expect(clean.id).toBe(record.id); expect(clean.inputSha256).toBe(record.inputSha256);
    expect(clean.originalText).toBe('Damage 1d6\r\n[buyer watermark redacted]\r\nPrice 2 cp\n');
    expect(clean.evidence[0].excerptSha256).toBe(privacyHash(clean.evidence[0].excerpt));
    expect(clean.sections[0].sha256).toBe(privacyHash(clean.sections[0].rawText));
    expect(sanitizeArtifact(clean)).toEqual(clean); expect(hasBuyerData(JSON.stringify(clean))).toBe(false);
    expect(record.originalText).toBe(text);
    expect(() => assertSafeArtifact('synthetic.json', JSON.stringify(record))).toThrow(/Buyer data/);
    expect(() => assertSafeArtifact('synthetic.json', JSON.stringify(clean))).not.toThrow();
  });

  it('persists no reversible buyer literal and requires the exact local original to restore sensitive lines', () => {
    const original = `Metadata\r\n${buyer}\r\n\`\`\`text\nDamage 1d6\n${buyer}\n\`\`\`\n`;
    const result = normalizeDocument(original, 'rules/synthetic.md');
    expect(result.changes).toHaveLength(2);
    expect(hasBuyerData(JSON.stringify(result.changes))).toBe(false);
    expect(hasBuyerData(JSON.stringify(result.diagnostics))).toBe(false);
    expect(replayChanges(original, result.changes)).toBe(result.normalizedText);
    expect(() => replayChanges(result.normalizedText, result.changes, true)).toThrow(/Local original required/);
    expect(replayChanges(result.normalizedText, result.changes, true, original)).toBe(original);
    expect(() => replayChanges(result.normalizedText, result.changes, true, original + 'changed')).toThrow(/revision mismatch/);
    expect(() => replayChanges(original.replace('Synthetic', 'Altered'), result.changes)).toThrow(/context mismatch/);
    const changedHash = result.changes.map(c => ({ ...c, beforeSha256: '0'.repeat(64) }));
    expect(() => replayChanges(original, changedHash)).toThrow(/context mismatch/);
    expect(normalizeDocument(result.normalizedText, 'rules/synthetic.md').changes).toEqual([]);
  });

  it('detects escaped JSON/JSONL strings and purchase markers without requiring a buyer name', () => {
    expect(inspectContent('sample.json', JSON.stringify({ evidence: [`Text\n${buyer}`] }))).toBe(1);
    expect(inspectContent('sample.jsonl', JSON.stringify({ snippet: buyer }) + '\n')).toBe(1);
    expect(hasBuyerData(`(#${['8765', '4321'].join('')})`)).toBe(true);
    expect(redactBuyerLines('Roll 3d6, price 2 cp; order of combat.')).toBe('Roll 3d6, price 2 cp; order of combat.');
  });

  it('keeps licensed derivatives out of tracked files and rejects buyer patterns in the remaining tree', () => {
    expect(auditTracked().findings).toEqual([]);
  });
});
