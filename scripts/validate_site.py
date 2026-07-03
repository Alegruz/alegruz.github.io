#!/usr/bin/env python3
"""Validate post metadata and generated site output."""

from __future__ import annotations

import json
import re
import sys
from datetime import date
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
ATTR_PATTERN = re.compile(r"""(href|src|srcset)=["']([^"']+)["']""")
MARKDOWN_LINK_PATTERN = re.compile(r"""(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)""")
POST_FILE_DATE_PATTERN = re.compile(r"^(\d{4})-(\d{2})-(\d{2})-")
SOURCE_EXTENSIONS = {".html", ".md", ".markdown"}
SOURCE_SKIP_PARTS = {
    ".git",
    ".jekyll-cache",
    ".sass-cache",
    "_site",
    "assets/externals",
    "node_modules",
    "vendor",
}
REMOVED_INTERNAL_PATHS = {"/start/"}


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


def parse_scalar(value: str) -> object:
    value = value.strip()
    if value == "true":
        return True
    if value == "false":
        return False
    if value.isdigit():
        return int(value)
    return value.strip("\"'")


def load_image_manifest() -> dict[str, dict[str, object]]:
    records: dict[str, dict[str, object]] = {}
    if not MANIFEST.exists():
        return records

    current: dict[str, object] | None = None
    for line in read_text(MANIFEST).splitlines():
        if line.startswith("  - path: "):
            if current and isinstance(current.get("path"), str):
                records[str(current["path"])] = current
            current = {"path": line.split(":", 1)[1].strip()}
        elif current is not None and line.startswith("    ") and ":" in line:
            key, value = line.strip().split(":", 1)
            current[key] = parse_scalar(value)

    if current and isinstance(current.get("path"), str):
        records[str(current["path"])] = current
    return records


def validate_posts() -> list[str]:
    errors: list[str] = []
    topics = read_data_keys(ROOT / "_data" / "topics.yml")
    series_keys = read_data_keys(ROOT / "_data" / "series.yml")
    translations: dict[str, list[tuple[Path, str | None]]] = {}
    titles: dict[tuple[str | None, str], list[Path]] = {}
    series_orders: dict[str, list[tuple[int, Path]]] = {}
    today = date.today()

    for path in sorted(POSTS.glob("*")):
        if path.suffix.lower() not in {".md", ".markdown"}:
            continue
        date_match = POST_FILE_DATE_PATTERN.match(path.name)
        if not date_match:
            errors.append(f"{path.relative_to(ROOT)}: filename must start with YYYY-MM-DD")
        else:
            year, month, day = (int(value) for value in date_match.groups())
            try:
                post_date = date(year, month, day)
            except ValueError as exc:
                errors.append(f"{path.relative_to(ROOT)}: invalid filename date: {exc}")
                post_date = today
            if post_date > today:
                errors.append(f"{path.relative_to(ROOT)}: post date is in the future")
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
        else:
            normalized_title = re.sub(r"\s+", " ", title).strip().casefold()
            titles.setdefault((lang, normalized_title), []).append(path)
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
                parsed_series_order = int(series_order or "0")
                if parsed_series_order < 1:
                    raise ValueError
            except ValueError:
                errors.append(f"{path.relative_to(ROOT)}: invalid series_order {series_order!r}")
            else:
                series_orders.setdefault(series, []).append((parsed_series_order, path))
        elif series_order:
            errors.append(f"{path.relative_to(ROOT)}: series_order without series")
        if translation_key:
            translations.setdefault(translation_key, []).append((path, lang))

    for (lang, title), paths in sorted(titles.items()):
        if len(paths) > 1:
            post_list = ", ".join(str(path.relative_to(ROOT)) for path in paths)
            errors.append(f"duplicate title {title!r} for lang {lang!r}: {post_list}")

    for series, rows in sorted(series_orders.items()):
        by_order: dict[int, list[Path]] = {}
        for order, path in rows:
            by_order.setdefault(order, []).append(path)

        for order, paths in sorted(by_order.items()):
            if len(paths) > 1:
                post_list = ", ".join(str(path.relative_to(ROOT)) for path in paths)
                errors.append(f"series {series!r}: duplicate series_order {order}: {post_list}")

        orders = sorted(by_order)
        expected = list(range(1, len(orders) + 1))
        if orders != expected:
            errors.append(f"series {series!r}: series_order values are {orders}; expected {expected}")

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


def urls_from_attr(attr_name: str, raw_value: str) -> list[str]:
    raw_value = unescape(raw_value).strip()
    if not raw_value:
        return []
    if attr_name != "srcset":
        return [raw_value]

    urls: list[str] = []
    for candidate in raw_value.split(","):
        candidate = candidate.strip()
        if not candidate:
            continue
        urls.append(candidate.split()[0])
    return urls


def should_skip_source(path: Path) -> bool:
    relative = path.relative_to(ROOT).as_posix()
    return any(relative == part or relative.startswith(f"{part}/") for part in SOURCE_SKIP_PARTS)


def source_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS and not should_skip_source(path):
            files.append(path)
    return sorted(files)


def urls_from_source(text: str) -> list[str]:
    urls: list[str] = []
    for match in ATTR_PATTERN.finditer(text):
        urls.extend(urls_from_attr(match.group(1), match.group(2)))
    for match in MARKDOWN_LINK_PATTERN.finditer(text):
        urls.append(unescape(match.group(1)).strip())
    return urls


def validate_source_links() -> list[str]:
    errors: list[str] = []
    if not SITE.exists():
        return ["_site does not exist; run `bundle exec jekyll build` first"]

    for path in source_files():
        text = read_text(path)
        relative = path.relative_to(ROOT)
        for removed_path in REMOVED_INTERNAL_PATHS:
            if removed_path in text:
                errors.append(f"{relative}: references removed internal path {removed_path!r}")

        for raw_url in urls_from_source(text):
            if "{{" in raw_url or "{%" in raw_url:
                continue
            parsed = urlparse(raw_url)
            if parsed.scheme or parsed.netloc or not parsed.path.startswith("/"):
                continue
            if not generated_target_exists(SITE / "index.html", raw_url):
                errors.append(f"{relative}: broken source internal link {raw_url!r}")
    return errors


def validate_generated_links() -> list[str]:
    errors: list[str] = []
    if not SITE.exists():
        return ["_site does not exist; run `bundle exec jekyll build` first"]

    for page in sorted(SITE.rglob("*.html")):
        text = read_text(page)
        for match in ATTR_PATTERN.finditer(text):
            for url in urls_from_attr(match.group(1), match.group(2)):
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
    post_count = len([
        path for path in POSTS.glob("*")
        if path.suffix.lower() in {".md", ".markdown"}
    ])
    search_index = SITE / "search.json"
    if not search_index.exists():
        errors.append("_site/search.json was not generated")
    else:
        try:
            records = json.loads(read_text(search_index))
        except json.JSONDecodeError as exc:
            errors.append(f"_site/search.json is invalid JSON: {exc}")
        else:
            if not isinstance(records, list):
                errors.append("_site/search.json must contain a JSON array")
            else:
                if len(records) != post_count:
                    errors.append(f"_site/search.json has {len(records)} records; expected {post_count}")
                required_keys = {"title", "url", "content"}
                for index, record in enumerate(records):
                    if not isinstance(record, dict):
                        errors.append(f"_site/search.json record {index} is not an object")
                        continue
                    missing = required_keys.difference(record)
                    if missing:
                        errors.append(f"_site/search.json record {index} missing {sorted(missing)}")

    json_feed = SITE / "feed.json"
    if not json_feed.exists():
        errors.append("_site/feed.json was not generated")
    else:
        try:
            feed = json.loads(read_text(json_feed))
        except json.JSONDecodeError as exc:
            errors.append(f"_site/feed.json is invalid JSON: {exc}")
        else:
            if not isinstance(feed, dict):
                errors.append("_site/feed.json must contain a JSON object")
            else:
                items = feed.get("items")
                if not isinstance(items, list):
                    errors.append("_site/feed.json items must be a JSON array")
                elif len(items) != post_count:
                    errors.append(f"_site/feed.json has {len(items)} items; expected {post_count}")
                else:
                    required_keys = {"id", "url", "title", "content_html", "date_published"}
                    for index, item in enumerate(items):
                        if not isinstance(item, dict):
                            errors.append(f"_site/feed.json item {index} is not an object")
                            continue
                        missing = required_keys.difference(item)
                        if missing:
                            errors.append(f"_site/feed.json item {index} missing {sorted(missing)}")
    if not MANIFEST.exists():
        errors.append("_data/image_manifest.yml was not generated; run `python scripts/optimize_images.py`")
    return errors


def referenced_local_images() -> set[Path]:
    if not SITE.exists():
        return set()

    references: set[Path] = set()
    for page in sorted(SITE.rglob("*.html")):
        text = read_text(page)
        for match in ATTR_PATTERN.finditer(text):
            for raw_url in urls_from_attr(match.group(1), match.group(2)):
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


def image_budget(record: dict[str, object] | None, path: Path) -> int:
    if (record and record.get("animated") is True) or path.suffix.lower() == ".gif":
        return ANIMATED_IMAGE_BUDGET
    return STATIC_IMAGE_BUDGET


def validate_image_budgets() -> list[str]:
    errors: list[str] = []
    manifest = load_image_manifest()
    for path in sorted(referenced_local_images()):
        relative_path = path.relative_to(ROOT).as_posix()
        record = manifest.get(relative_path)
        budget = image_budget(record, path)
        size = path.stat().st_size
        if size <= budget:
            continue

        webp = record.get("webp") if record else None
        webp_path = ROOT / str(webp) if webp else None
        webp_record = manifest.get(str(webp)) if webp else None
        webp_budget = image_budget(webp_record, webp_path) if webp_path is not None else 0
        if webp_path is not None and webp_path.exists() and webp_path.stat().st_size <= webp_budget:
            continue

        size_mb = size / 1_000_000
        budget_mb = budget / 1_000_000
        errors.append(f"{path.relative_to(ROOT)} is {size_mb:.1f} MB; budget is {budget_mb:.1f} MB")
    return errors


def main() -> int:
    errors = (
        validate_posts()
        + validate_generated_files()
        + validate_source_links()
        + validate_generated_links()
        + validate_generated_images()
        + validate_image_budgets()
    )
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print("site validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
