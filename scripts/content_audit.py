#!/usr/bin/env python3
"""Report content cleanup opportunities without failing the site build."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "_posts"
LOCAL_IMAGE_PATTERN = re.compile(r"""!\[[^\]]*\]\((/assets/images/[^)\s]+)(?:\s+["'][^)]*["'])?\)""")
STANDALONE_LOCAL_IMAGE_PATTERN = re.compile(r"""^\s*!\[[^\]]*\]\((/assets/images/[^)\s]+)(?:\s+["'][^)]*["'])?\)\s*$""")
MATH_PATTERN = re.compile(r"""\$\$|\\\(|\\\[|\\begin\{""")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def split_front_matter(path: Path) -> tuple[str, str]:
    text = read_text(path).lstrip("\ufeff")
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        return "", text
    return match.group(1), text[match.end():]


def parse_front_matter(front_matter: str) -> dict[str, str]:
    data: dict[str, str] = {}
    for line in front_matter.splitlines():
        if ":" not in line or line.startswith(" "):
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("\"'")
    return data


def post_files() -> list[Path]:
    return sorted(path for path in POSTS.glob("*") if path.suffix.lower() in {".md", ".markdown"})


def main() -> int:
    raw_inline_images: list[str] = []
    raw_standalone_images: list[str] = []
    missing_math_flags: list[str] = []
    missing_tags: list[str] = []
    generic_descriptions: list[str] = []

    for path in post_files():
        front_matter, body = split_front_matter(path)
        metadata = parse_front_matter(front_matter)
        relative = path.relative_to(ROOT)

        if MATH_PATTERN.search(body) and metadata.get("math") != "true":
            missing_math_flags.append(str(relative))
        if "tags" not in metadata:
            missing_tags.append(str(relative))
        if metadata.get("description", "").startswith("Notes on "):
            generic_descriptions.append(str(relative))

        for line_number, line in enumerate(read_text(path).splitlines(), start=1):
            if not LOCAL_IMAGE_PATTERN.search(line):
                continue
            target = f"{relative}:{line_number}"
            if STANDALONE_LOCAL_IMAGE_PATTERN.match(line):
                raw_standalone_images.append(target)
            else:
                raw_inline_images.append(target)

    sections = [
        ("standalone local Markdown images", raw_standalone_images, "convert to `{% include image.html ... %}`"),
        ("inline/list local Markdown images", raw_inline_images, "review manually; many are equations or list items"),
        ("posts with TeX but no math flag", missing_math_flags, "add `math: true`"),
        ("posts without tags", missing_tags, "add 2-6 lowercase tags"),
        ("generic descriptions", generic_descriptions, "replace with a specific summary"),
    ]

    for title, rows, advice in sections:
        print(f"{title}: {len(rows)}")
        if rows:
            print(f"  advice: {advice}")
            for row in rows[:20]:
                print(f"  - {row}")
            if len(rows) > 20:
                print(f"  - +{len(rows) - 20} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
