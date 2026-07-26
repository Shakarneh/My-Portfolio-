"""
One-off: sorts "photos and videos/" into assets/photos, assets/projects/<project>, assets/video.

Run once:  python organize_assets.py
Then delete this script and the old folder.
"""

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "photos and videos"
OUT = ROOT / "assets"

# ── explicit renames: source filename -> destination relative to assets/ ──────
EXPLICIT = {
    # people & places
    "photo_1_2026-07-26_16-29-40.jpg": "photos/portrait-studio.jpg",
    "photo_2_2026-07-26_16-29-40.jpg": "photos/desk-new-wide.jpg",
    "photo_3_2026-07-26_16-29-40.jpg": "photos/desk-new-angle.jpg",
    "photo_5_2026-07-26_16-29-40.jpg": "photos/laptop-night-code.jpg",
    "photo_6_2026-07-26_16-29-40.jpg": "photos/award-bstu.jpg",
    "photo_7_2026-07-26_16-29-40.jpg": "photos/java-handwritten-notes.jpg",
    "photo_8_2026-07-26_16-29-40.jpg": "photos/desk-old-monitor.jpg",
    "photo_9_2026-07-26_16-29-40.jpg": "photos/desk-old-laptops.jpg",
    "photo_4_2026-07-26_16-29-40.jpg": "photos/_unused-casual.jpg",
    # internship / attendance system
    "1-swagger-api-endpoints.png": "projects/attendance/swagger.png",
    "2-jwt-authentication.png": "projects/attendance/jwt-auth.png",
    "3-admin-panel.png": "projects/attendance/admin-panel.png",
    "4-schedule-conflict-detection.png": "projects/attendance/conflict-detection.png",
    "Screenshot 2026-07-26 163211.png": "projects/attendance/github-repo.png",
    "Screenshot 2026-07-26 163544.png": "projects/attendance/code-fastapi.png",
    # ai website
    "1785064407335.jpg": "projects/ai-website/home.jpg",
    # java labs
    "1785065988597.jpg": "projects/java-labs/intellij.jpg",
    # lolo source
    "Screenshot 2026-07-26 163911.png": "projects/lolo/code-supabase.png",
    # my notes
    "Screenshot 2026-07-26 164102.png": "projects/my-notes/code-theme.png",
    # data analysis
    "Screenshot 2026-07-26 164211.png": "projects/data-analysis/dataset.png",
    # ai agent (hackerrank orchestrate)
    "Screenshot 2026-07-26 163422.png": "projects/ai-agent/code-agent.png",
    # github profile
    "Screenshot 2026-07-26 164310.png": "projects/github-profile/readme.png",
}

# ── timestamp ranges for the remaining screenshots ────────────────────────────
# (HHMMSS start, HHMMSS end, destination folder, prefix)
RANGES = [
    (163339, 163521, "projects/ai-agent", "shot"),
    (163600, 163905, "projects/attendance", "shot"),
    (163912, 164101, "projects/lolo", "code"),
    (164103, 164210, "projects/my-notes", "shot"),
    (164212, 164309, "projects/data-analysis", "shot"),
    (164311, 164348, "projects/github-profile", "shot"),
    (164349, 164600, "projects/lolo", "site"),
    (164900, 165200, "projects/ai-website", "shot"),
]

VIDEO_EXT = {".mp4", ".mov"}


def dest_for(name: str) -> str | None:
    if name in EXPLICIT:
        return EXPLICIT[name]

    if Path(name).suffix.lower() in VIDEO_EXT:
        return f"video/{name.lower()}"

    m = re.search(r"(\d{6})(?=\.\w+$)", name)          # trailing HHMMSS
    if m:
        stamp = int(m.group(1))
        for lo, hi, folder, prefix in RANGES:
            if lo <= stamp <= hi:
                return f"{folder}/{prefix}-{stamp}.png"

    return f"_unsorted/{name}"


def main() -> None:
    if not SRC.exists():
        print(f"nothing to do — {SRC.name} not found")
        return

    counts: dict[str, int] = {}
    for item in sorted(SRC.iterdir()):
        if not item.is_file():
            continue
        rel = dest_for(item.name)
        target = OUT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(item, target)
        bucket = str(Path(rel).parent)
        counts[bucket] = counts.get(bucket, 0) + 1

    for bucket in sorted(counts):
        print(f"{counts[bucket]:>3}  assets/{bucket}")
    print("\ncopied — originals left untouched in 'photos and videos/'")


if __name__ == "__main__":
    main()
