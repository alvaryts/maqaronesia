#!/usr/bin/env python3

from __future__ import annotations

import argparse
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - runtime guard
    raise SystemExit(
        "Pillow is required to optimize post images. Run this script with the bundled Codex Python runtime."
    ) from exc


def iter_source_files(paths: list[str]) -> list[Path]:
    files: list[Path] = []

    for raw_path in paths:
        path = Path(raw_path)
        if path.is_dir():
            files.extend(
                sorted(
                    candidate
                    for candidate in path.iterdir()
                    if candidate.suffix.lower() in {".png", ".jpg", ".jpeg"}
                )
            )
        elif path.suffix.lower() in {".png", ".jpg", ".jpeg"}:
            files.append(path)

    return files


def optimize_image(path: Path, quality: int, delete_source: bool) -> Path:
    target = path.with_suffix(".webp")

    with Image.open(path) as image:
        image.save(target, format="WEBP", quality=quality, method=6)

    if delete_source and target != path:
        path.unlink()

    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert post cover images to optimized WebP files.")
    parser.add_argument("paths", nargs="+", help="Files or directories to optimize.")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality value (default: 82).")
    parser.add_argument(
        "--delete-source",
        action="store_true",
        help="Delete the original PNG/JPG file after creating the WebP version.",
    )
    args = parser.parse_args()

    source_files = iter_source_files(args.paths)
    if not source_files:
        raise SystemExit("No PNG/JPG files found to optimize.")

    for source in source_files:
        target = optimize_image(source, args.quality, args.delete_source)
        print(f"{source} -> {target}")


if __name__ == "__main__":
    main()
