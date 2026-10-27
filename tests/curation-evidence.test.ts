import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ReviewSchema } from '../packages/curation/evidence';

const sha = (text: string | Buffer) => createHash('sha256').update(text).digest('hex');
export function mdReview() {
  const path = 'rules/SotDL_All_Ancestries_Compendium_Expanded_All_Project_Sources_v2.md';
  const bytes = readFileSync(path); const excerpt = bytes.toString('utf8').split(/\r\n|\n|\r/).slice(180, 183).join('\n');
  const axis = (status: string, evidenceIds: string[] = []) => ({ status, responsible: 'Codex / análise local', reason: 'Amostra de metadados; não certifica a mecânica da ancestry.', evidenceIds });
  return { schemaVersion: 1, subjectId: 'source-reference:ancestries:181',
    sourcePermission: axis('needs-review'), transcription: axis('md-checked', ['md:ancestries:181']),
    structure: axis('unreviewed'), mechanics: axis('unreviewed'),
    automation: { ...axis('unsupported'), handlerRef: null, testRefs: [] },
    evidence: [{ id: 'md:ancestries:181', medium: 'md', path, inputSha256: sha(bytes), startLine: 181, endLine: 183,
      physicalPdfPage: null, printedPageDeclared: '15', pdfPageDeclared: '15', heading: '### Arachne',
      excerpt, excerptSha256: sha(excerpt), claim: 'Metadados localizados no MD; páginas apenas declaradas.' }] };
}
describe('review evidence', () => {
  it('keeps a verified MD excerpt independent from mechanical/automation approval', () => {
    const review = ReviewSchema.parse(JSON.parse(readFileSync('curation/review-example.json', 'utf8')));
    expect(review).toEqual(ReviewSchema.parse(mdReview()));
    expect(sha(review.evidence[0].excerpt)).toBe(review.evidence[0].excerptSha256);
    expect(review.mechanics.status).toBe('unreviewed');
    expect(review.automation.status).toBe('unsupported');
  });
  it('rejects inherited PDF certification, missing evidence and unsupported automation', () => {
    const pdf = mdReview(); pdf.transcription.status = 'pdf-checked';
    expect(ReviewSchema.safeParse(pdf).success).toBe(false);
    const missing = mdReview(); missing.transcription.evidenceIds = ['absent'];
    expect(ReviewSchema.safeParse(missing).success).toBe(false);
    const automatic = mdReview(); automatic.automation.status = 'implemented';
    expect(ReviewSchema.safeParse(automatic).success).toBe(false);
  });
});
