#!/usr/bin/env python3
"""Validate post metadata and generated site output."""

from __future__ import annotations

import re
import sys
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "_posts"
SITE = ROOT / "_site"
MANIFEST = ROOT / "_data" / "image_manifest.yml"
LANGS = {"en", "ko"}
STATUSES = {"notes", "report", "translation", "draft"}
DIFFICULTIES = {"beginner", "intermediate", "advanced"}
IMAGE_SUFFIXES = {".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"}
STATIC_IMAGE_BUDGET = 1_500_000
ANIMATED_IMAGE_BUDGET = 6_000_000


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def read_data_keys(path: Path) -> set[str]:
    keys: set[str] = set()
    for line in read_text(path).splitlines():
        match = re.match(r"^([a-z0-9-]+):\s*$", line)
        if match:
            keys.add(match.group(1))
    return keys


def parse_front_matter(path: Path) -> dict[str, str]:
    text = read_text(path).lstrip("\ufeff")
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        raise ValueError("missing YAML front matter")

    data: dict[str, str] = {}
    for line in match.group(1).splitlines():
        if ":" not in line or line.startswith(" "):
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("\"'")
    return data


def validate_posts() -> list[str]:
    errors: list[str] = []
    topics = read_data_keys(ROOT / "_data" / "topics.yml")
    series_keys = read_data_keys(ROOT / "_data" / "series.yml")
    translations: dict[str, list[tuple[Path, str | None]]] = {}

    for path in sorted(POSTS.glob("*")):
        if path.suffix.lower() not in {".md", ".markdown"}:
            continue
        try:
            front_matter = parse_front_matter(path)
        except ValueError as exc:
            errors.append(f"{path.relative_to(ROOT)}: {exc}")
            continue

        title = front_matter.get("title")
        lang = front_matter.get("lang")
        topic = front_matter.get("topic")
        description = front_matter.get("description")
        status = front_matter.get("status")
        difficulty = front_matter.get("difficulty")
        series = front_matter.get("series")
        series_order = front_matter.get("series_order")
        translation_key = front_matter.get("translation_key")

        if not title:
            errors.append(f"{path.relative_to(ROOT)}: missing title")
        if lang not in LANGS:
            errors.append(f"{path.relative_to(ROOT)}: invalid lang {lang!r}")
        if topic not in topics:
            errors.append(f"{path.relative_to(ROOT)}: invalid topic {topic!r}")
        if not description:
            errors.append(f"{path.relative_to(ROOT)}: missing description")
        elif description.startswith("Notes on "):
            errors.append(f"{path.relative_to(ROOT)}: generic description")
        if status not in STATUSES:
            errors.append(f"{path.relative_to(ROOT)}: invalid status {status!r}")
        if difficulty not in DIFFICULTIES:
            errors.append(f"{path.relative_to(ROOT)}: invalid difficulty {difficulty!r}")
        if series:
            if series not in series_keys:
                errors.append(f"{path.relative_to(ROOT)}: invalid series {series!r}")
            try:
                if int(series_order or "0") < 1:
                    raise ValueError
            except ValueError:
                errors.append(f"{path.relative_to(ROOT)}: invalid series_order {series_order!r}")
        elif series_order:
            errors.append(f"{path.relative_to(ROOT)}: series_order without series")
        if translation_key:
            translations.setdefault(translation_key, []).append((path, lang))

    for translation_key, rows in sorted(translations.items()):
        langs = [lang for _, lang in rows]
        if len(rows) < 2:
            errors.append(f"translation_key {translation_key!r}: only one post")
        if len(langs) != len(set(langs)):
            paths = ", ".join(str(path.relative_to(ROOT)) for path, _ in rows)
            errors.append(f"translation_key {translation_key!r}: duplicate language in {paths}")
    return errors


def is_external(url: str) -> bool:
    lowered = url.lower()
    return lowered.startswith((
        "http://",
        "https://",
        "mailto:",
        "tel:",
        "javascript:",
        "data:",
    ))


def generated_target_exists(page: Path, raw_url: str) -> bool:
    raw_url = unescape(raw_url)
    if not raw_url or raw_url.startswith("#") or is_external(raw_url):
        return True

    parsed = urlparse(raw_url)
    if parsed.scheme or parsed.netloc:
        return True

    path = unquote(parsed.path)
    if not path:
        return True

    if path.startswith("/"):
        target = SITE / path.lstrip("/")
    else:
        target = page.parent / path

    candidates = [target]
    if target.suffix:
        candidates.append(target.with_suffix(target.suffix))
    else:
        candidates.extend([target / "index.html", target.with_suffix(".html")])

    return any(candidate.exists() for candidate in candidates)


def validate_generated_links() -> list[str]:
    errors: list[str] = []
    if not SITE.exists():
        return ["_site does not exist; run `bundle exec jekyll build` first"]

    attr_pattern = re.compile(r"""(?:href|src)=["']([^"']+)["']""")
    for page in sorted(SITE.rglob("*.html")):
        text = read_text(page)
        for match in attr_pattern.finditer(text):
            url = match.group(1)
            if not generated_target_exists(page, url):
                errors.append(f"{page.relative_to(ROOT)}: broken internal link {url!r}")
    return errors


def validate_generated_images() -> list[str]:
    errors: list[str] = []
    if not SITE.exists():
        return ["_site does not exist; run `bundle exec jekyll build` first"]

    image_pattern = re.compile(r"<img\b[^>]*>", re.I)
    alt_pattern = re.compile(r"\balt\s*=", re.I)
    for page in sorted(SITE.rglob("*.html")):
        text = read_text(page)
        for match in image_pattern.finditer(text):
            tag = match.group(0)
            if not alt_pattern.search(tag):
                errors.append(f"{page.relative_to(ROOT)}: image missing alt attribute")
    return errors


def validate_generated_files() -> list[str]:
    errors: list[str] = []
    if not (SITE / "search.json").exists():
        errors.append("_site/search.json was not generated")
    if not MANIFEST.exists():
        errors.append("_data/image_manifest.yml was not generated; run `python scripts/optimize_images.py`")
    return errors


def referenced_local_images() -> set[Path]:
    if not SITE.exists():
        return set()

    references: set[Path] = set()
    attr_pattern = re.compile(r"""(?:href|src)=["']([^"']+)["']""")
    for page in sorted(SITE.rglob("*.html")):
        text = read_text(page)
        for match in attr_pattern.finditer(text):
            raw_url = unescape(match.group(1))
            if not raw_url or raw_url.startswith("#") or is_external(raw_url):
                continue
            parsed = urlparse(raw_url)
            path = unquote(parsed.path)
            if not path:
                continue

            if path.startswith("/"):
                site_target = SITE / path.lstrip("/")
            else:
                site_target = page.parent / path
            if site_target.suffix.lower() not in IMAGE_SUFFIXES:
                continue

            try:
                relative_site_target = site_target.resolve().relative_to(SITE.resolve())
            except ValueError:
                continue
            source_target = ROOT / relative_site_target
            if source_target.exists():
                references.add(source_target)
    return references


def collect_warnings() -> list[str]:
    warnings: list[str] = []
    images = referenced_local_images()
    if not images:
        return warnings

    for path in sorted(images):
        budget = ANIMATED_IMAGE_BUDGET if path.suffix.lower() in {".gif", ".webp"} else STATIC_IMAGE_BUDGET
        if path.stat().st_size > budget:
            size_mb = path.stat().st_size / 1_000_000
            budget_mb = budget / 1_000_000
            warnings.append(f"{path.relative_to(ROOT)} is {size_mb:.1f} MB; budget is {budget_mb:.1f} MB")
    return warnings


def main() -> int:
    warnings = collect_warnings()
    for warning in warnings:
        print(f"warning: {warning}", file=sys.stderr)

    errors = (
        validate_posts()
        + validate_generated_files()
        + validate_generated_links()
        + validate_generated_images()
    )
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print("site validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
