#!/usr/bin/env python3
"""Check math-wiki language pairs, coverage metadata, and reviewed source revisions.

This verifies structure and source drift, not semantic translation completeness.
"""
from __future__ import annotations

import hashlib
import re
from collections import Counter, defaultdict
from pathlib import Path

from validate_site import parse_front_matter_text, split_front_matter

ROOT = Path(__file__).resolve().parents[1]
WIKI_LINK = re.compile(r"['\"](/wiki/[^'\"#]+/)(?:#[^'\"]*)?['\"]\s*\|\s*relative_url")


def complete_page_parity(english: str, korean: str) -> list[str]:
    """Catch dropped sections/assets without claiming to assess Korean meaning."""
    errors = []
    for label, pattern in (
        ('heading levels', r'^#{2,6}(?= )'),
        ('exercise reveals', r'<details\b'),
        ('code fences', r'^```[^\n]*'),
    ):
        if re.findall(pattern, english, re.M) != re.findall(pattern, korean, re.M):
            errors.append(f'{label} differ from English')

    def formulas(body: str) -> list[str]:
        # Prose within a formula is translated; the mathematical expression stays.
        return [re.sub(r'\s+', '', re.sub(r'\\text\{[^{}]*\}', r'\\text{}', block))
                for block in re.findall(r'\$\$(.*?)\$\$', body, re.S)]

    if formulas(english) != formulas(korean):
        errors.append('displayed formulas differ from English')
    urls = r'''https?://[^\s<>"')]+'''
    if Counter(re.findall(urls, english)) != Counter(re.findall(urls, korean)):
        errors.append('external source URLs differ from English')

    def labs(body: str) -> list[tuple[str, str]]:
        return [(name.removesuffix('-ko'), kind or '') for name, kind in re.findall(
            r'{% include ([\w-]*lab[\w-]*)\.html(?:\s+kind="([^"]+)")?', body)]

    if labs(english) != labs(korean):
        errors.append('interactive examples differ from English')
    images = r'/assets/images/wiki/[^\s"\x27]+\.svg'
    expected = [url.removesuffix('.svg') + '-ko.svg' for url in re.findall(images, english)]
    if expected != re.findall(images, korean):
        errors.append('localized diagrams differ from English')
    return errors


def validate_wiki_translations(root: Path = ROOT) -> list[str]:
    errors: list[str] = []
    groups: dict[str, list[tuple[Path, dict[str, str], str]]] = defaultdict(list)
    paths = sorted((root / '_wiki').rglob('*.md'))
    for path in paths:
        if path.name == 'AGENTS.md':
            continue
        name = path.relative_to(root)
        try:
            fm, body = split_front_matter(path)
        except ValueError as exc:
            errors.append(f'{name}: {exc}')
            continue
        meta = parse_front_matter_text(fm)
        for field in ('title', 'description', 'subject', 'lang', 'translation_key'):
            if not meta.get(field):
                errors.append(f'{name}: missing {field}')
        lang = meta.get('lang')
        if lang not in {'en', 'ko'}:
            errors.append(f'{name}: lang must be en or ko')
        slug = path.stem.removesuffix('-ko')
        expected_key = f'wiki-{path.parent.name}-{slug}'
        if meta.get('translation_key') != expected_key:
            errors.append(f'{name}: expected translation_key {expected_key}')
        if (lang == 'ko') != path.stem.endswith('-ko'):
            errors.append(f'{name}: only Korean filenames must end in -ko.md')
        groups[meta.get('translation_key', str(name))].append((path, meta, body))

        if lang == 'ko':
            if not re.search(r'[가-힣]', body):
                errors.append(f'{name}: Korean body is missing')
            if not re.search(r'^## .*참고\s*문헌', body, re.M):
                errors.append(f'{name}: Korean References section is missing')
            status = meta.get('translation_status')
            if status not in {'in_progress', 'complete'}:
                errors.append(f'{name}: translation_status must be in_progress or complete')
            if status == 'in_progress' and not meta.get('translation_remaining'):
                errors.append(f'{name}: partial translation must describe remaining work')
            if status == 'complete' and meta.get('translation_remaining'):
                errors.append(f'{name}: complete translation still lists remaining work')
            for url in WIKI_LINK.findall(body):
                english_counterpart = f'/wiki/{path.parent.name}/{slug}/'
                if url not in {'/wiki/', '/wiki/ko/', english_counterpart} and not url.endswith('-ko/'):
                    errors.append(f'{name}: prerequisite/related wiki link must target Korean: {url}')

    for key, rows in groups.items():
        en = [row for row in rows if row[1].get('lang') == 'en']
        ko = [row for row in rows if row[1].get('lang') == 'ko']
        if len(en) != 1 or len(ko) != 1:
            errors.append(f'{key}: expected exactly one English and one Korean page')
            continue
        en_path, en_meta, en_body = en[0]
        ko_path, ko_meta, ko_body = ko[0]
        if ko_path != en_path.with_name(en_path.stem + '-ko.md'):
            errors.append(f'{key}: Korean counterpart must be beside the English page')
        if en_meta.get('subject') != ko_meta.get('subject'):
            errors.append(f'{key}: subjects must match')
        digest = hashlib.sha256(en_body.encode('utf-8')).hexdigest()
        if ko_meta.get('translation_source_sha256') != digest:
            errors.append(f'{ko_path.relative_to(root)}: English body changed or source hash missing; review both versions')
        if ko_meta.get('translation_status') == 'complete':
            for error in complete_page_parity(en_body, ko_body):
                errors.append(f'{ko_path.relative_to(root)}: {error}')
            for url in re.findall(r'/assets/images/wiki/[^\s"\x27]+\.svg', ko_body):
                if not (root / url.lstrip('/')).is_file():
                    errors.append(f'{ko_path.relative_to(root)}: missing diagram {url}')
    return errors


def main() -> int:
    errors = validate_wiki_translations()
    for error in errors:
        print(error)
    if errors:
        return 1
    pages = len([p for p in (ROOT / '_wiki').rglob('*.md') if p.name != 'AGENTS.md'])
    print(f'wiki translation validation passed: {pages // 2} English/Korean pairs')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
