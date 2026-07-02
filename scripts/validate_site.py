#!/usr/bin/env python3
"""Validate post metadata and generated internal links."""

from __future__ import annotations

import re
import sys
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "_posts"
SITE = ROOT / "_site"
TOPICS = {"rendering", "api", "theory", "engine"}
LANGS = {"en", "ko"}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


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

        if not title:
            errors.append(f"{path.relative_to(ROOT)}: missing title")
        if lang not in LANGS:
            errors.append(f"{path.relative_to(ROOT)}: invalid lang {lang!r}")
        if topic not in TOPICS:
            errors.append(f"{path.relative_to(ROOT)}: invalid topic {topic!r}")
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


def main() -> int:
    errors = validate_posts() + validate_generated_links()
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print("site validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
