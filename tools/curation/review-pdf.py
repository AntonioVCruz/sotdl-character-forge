"""Local-only PDF concordance aid. Requires pypdf; never emits source text.

Usage: python tools/curation/review-pdf.py --source-root PATH --pdf-dir PATH
Output is deliberately ignored. Token concordance is not semantic approval.
"""
import argparse
import hashlib
import json
import re
import unicodedata
import platform
from pathlib import Path
from pypdf import PdfReader, __version__ as pypdf_version

LOTS = ['table-closure', 'professions-languages', 'wealth-equipment',
        'interesting-things', 'items', 'core-level-zero', 'human-ancestry']
SOURCES = {'sotdl:shadow-of-the-demon-lord-core': 'core',
           'sotdl:only-human': 'human',
           'sotdl:oddities-artifacts-and-esoterica': 'oddities'}


def normalize(text):
    text = re.sub(r'[^\r\n]*\((?:order\s*)?#\d{4,}\)[^\r\n]*', '', text, flags=re.I)
    text = unicodedata.normalize('NFKD', text).lower()
    return re.sub('[^a-z0-9]', '', text)


def concordance(excerpt, pages, texts):
    needle = normalize(excerpt)
    exact = [n+1 for n, text in enumerate(texts) if needle and needle in text]
    if exact:
        return {'candidatePages': exact, 'coverage': 1, 'status': 'text-concordant'}
    # Overlapping character shingles tolerate PDF column order and line wrapping.
    shingles = {needle[i:i+16] for i in range(max(0, len(needle)-15))}
    if not shingles:
        return {'candidatePages': [], 'coverage': 0, 'status': 'manual-review'}
    scores = [(len(shingles & page)/len(shingles), n+1)
              for n, page in enumerate(pages)]
    scores.sort(reverse=True)
    selected = sorted(n for score, n in scores[:8] if score >= max(.08, scores[0][0]*.3))
    combined = len(shingles & set().union(*(pages[n-1] for n in selected)))/len(shingles)
    return {'candidatePages': selected, 'coverage': round(combined, 6),
            'status': 'text-concordant' if combined >= .95 else 'manual-review'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', type=Path, required=True)
    parser.add_argument('--pdf-dir', type=Path, required=True)
    args = parser.parse_args()
    pdfs, pages, texts = {}, {}, {}
    for source, key in SOURCES.items():
        path = args.pdf_dir / (key+'.pdf')
        data = path.read_bytes()
        reader = PdfReader(path)
        normalized = [normalize(p.extract_text()) for p in reader.pages]
        texts[source] = normalized
        pages[source] = [{p[i:i+16] for i in range(max(0,len(p)-15))} for p in normalized]
        pdfs[source] = {'sha256': hashlib.sha256(data).hexdigest(), 'pages': len(reader.pages)}
    evidence = {}
    for lot in LOTS:
        doc = json.loads((args.source_root / f'curation/pilot/{lot}.json').read_text(encoding='utf-8'))
        for e in doc['evidence']:
            if e['sourceId'] not in pages:
                continue
            key = e['sourceId']+'|'+e['id']+'|'+e['excerptSha256']
            if key not in evidence:
                evidence[key] = {'id': e['id'], 'sourceId': e['sourceId'],
                                 'excerptSha256': e['excerptSha256'],
                                 **concordance(e['excerpt'], pages[e['sourceId']], texts[e['sourceId']])}
    closure = json.loads((args.source_root / 'curation/pilot/table-closure.json').read_text(encoding='utf-8'))
    rows = []
    for table in closure['tables']:
        for stream in table['streams']:
            for row in stream['rows']:
                # Selector text is an implementation ID rather than a printed label.
                selector = row['text'].startswith(('core:', 'only-human:', 'oddities:'))
                match = ({'candidatePages': [], 'coverage': None, 'status': 'selector-reference'} if selector else
                         concordance(row['text'], pages[table['sourceId']], texts[table['sourceId']]))
                bounds = (str(row['max'])+'orless' if row['min'] is None else
                          str(row['min'])+'ormore' if row['max'] is None else
                          str(row['min']) if row['min']==row['max'] else str(row['min'])+str(row['max']))
                prefix = bounds+normalize(row['text'])[:25]
                range_match = not selector and any(prefix in texts[table['sourceId']][p-1] for p in match['candidatePages'])
                rows.append({'id': row['id'], 'sourceId': table['sourceId'], 'tableId': table['id'],
                             **match, 'rangePrefixConcordant': bool(range_match)})
    result = {'schemaVersion': 1, 'method': 'normalized-16-character-shingle-union-v1',
              'semanticApproval': False,
              'toolchain': {'python': platform.python_version(), 'pypdf': pypdf_version, 'unicode': unicodedata.unidata_version},
              'pdfs': pdfs, 'evidence': list(evidence.values()), 'rows': rows}
    output = Path('tmp/private/pdf-concordance.json')
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({'evidence': len(evidence), 'manualReview': sum(e['status']=='manual-review' for e in evidence.values()), 'output': str(output)}))


if __name__ == '__main__':
    main()
