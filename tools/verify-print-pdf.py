"""Local QA for browser-generated A4 PDFs. Requires pypdf; rendering also needs pypdfium2."""
import argparse
import json
from pathlib import Path
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument('pdf', type=Path)
parser.add_argument('--expect', action='append', default=[])
parser.add_argument('--forbid', action='append', default=[])
parser.add_argument('--render-dir', type=Path)
args = parser.parse_args()
reader = PdfReader(args.pdf)
texts = []
for index, page in enumerate(reader.pages):
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    assert abs(width - 595.28) < 1 and abs(height - 841.89) < 1, f'Page {index + 1} is not A4: {width}x{height}'
    text = page.extract_text() or ''
    # A page consisting only of footer text is an unwanted trailing page.
    meaningful = [line for line in text.splitlines() if line.strip() and not line.startswith(('Character Forge - demonstração', 'Página '))]
    assert meaningful, f'Empty page: {index + 1}'
    texts.append(text)
text = '\n'.join(texts)
normalized = ' '.join(text.split())
for expected in args.expect:
    assert ' '.join(expected.split()) in normalized, f'Missing text: {expected}'
for forbidden in args.forbid:
    assert ' '.join(forbidden.split()) not in normalized, f'Unexpected text: {forbidden}'
if args.render_dir:
    import pypdfium2 as pdfium
    args.render_dir.mkdir(parents=True, exist_ok=True)
    document = pdfium.PdfDocument(str(args.pdf))
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=1.5)
        bitmap.to_pil().save(args.render_dir / f'page-{index+1}.png')
        bitmap.close()
        page.close()
    document.close()
print(json.dumps({'pages': len(reader.pages), 'characters': len(text), 'a4': True}))
