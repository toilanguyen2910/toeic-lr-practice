# -*- coding: utf-8 -*-
"""
SINH FILE ÂM THANH CHO PART 1-4.

Vì sao cần file MP3 sinh sẵn thay vì để trình duyệt đọc:
- Giọng máy của trình duyệt đọc đều đều, không ngắt nghỉ theo dấu câu, và khác
  nhau trên từng máy. File MP3 thì mọi người nghe giống nhau và phát được offline.
- Hội thoại hai người cần HAI GIỌNG KHÁC NHAU. Script này dùng giọng nam/nữ xen kẽ
  theo đúng nhãn `M:` / `W:` trong dữ liệu.

Công cụ: Google Translate TTS (endpoint công khai, không cần khoá API).
Đã thử edge-tts (giọng neural Microsoft, tự nhiên hơn) nhưng dịch vụ đó trả 403
khi gọi từ môi trường này, nên phải dùng phương án còn chạy được.

Cách dùng:
  python scripts/generate-audio.py            # sinh tất cả còn thiếu
  python scripts/generate-audio.py --force    # sinh lại tất cả
  python scripts/generate-audio.py --only 3   # chỉ Part 3
  python scripts/generate-audio.py --check    # chỉ kiểm, không tải

Đầu ra: public/audio/<stimulusId>.mp3 + public/audio/manifest.json

Bản quyền: nội dung đọc do chính dự án viết; không chứa âm thanh nào của ETS.
"""

import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
OUT_DIR = ROOT / "public" / "audio"

# Google TTS từ chối chuỗi quá dài (thực nghiệm: >200 ký tự trả 400).
MAX_CHARS = 180

# Giọng: `tl=en` cho giọng Mỹ. Google không cho chọn giọng nam/nữ qua tham số
# này, nên để phân biệt hai người trong hội thoại ta dùng hai biến thể ngôn ngữ
# gần nhau (en-US và en-GB) — nghe rõ là hai người khác nhau.
VOICE_MALE = "en-GB"  # giọng Anh-Anh, nghe khác rõ so với giọng Mỹ
VOICE_FEMALE = "en"  # giọng Mỹ (mặc định)
VOICE_SINGLE = "en"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def parse_ts_stimuli() -> list[dict]:
    """Đọc các file part*.ts và rút ra id + part + audioScript."""
    stimuli = []
    for path in sorted(DATA_DIR.glob("part*.ts")):
        if path.name.endswith(".test.ts"):
            continue
        text = path.read_text(encoding="utf-8")

        for match in re.finditer(r"id:\s*'(g-p\d-\d+)',\s*part:\s*(\d+),", text):
            stim_id = match.group(1)
            part = int(match.group(2))
            start = match.end()
            nxt = text.find("id: '", start)
            block = text[start : nxt if nxt != -1 else len(text)]

            script_match = re.search(
                r"audioScript:\s*((?:'(?:[^'\\]|\\.)*'\s*\+?\s*)+)", block, re.S
            )
            if not script_match:
                continue

            raw = script_match.group(1)
            pieces = re.findall(r"'((?:[^'\\]|\\.)*)'", raw)
            script = "".join(pieces)
            script = script.replace("\\'", "'").replace('\\"', '"')
            script = re.sub(r"\s+", " ", script).strip()
            if script:
                stimuli.append({"id": stim_id, "part": part, "script": script})
    return stimuli


def split_by_speaker(script: str) -> list[tuple[str, str]]:
    """Tách lời thoại thành [(mã ngôn ngữ, câu)] theo nhãn M:/W:."""
    if not re.search(r"(^|\s)[MW]:", script):
        return [(VOICE_SINGLE, script)]

    positions = [m.start() for m in re.finditer(r"(?:^|(?<=\s))[MW]:", script)]
    if not positions:
        return [(VOICE_SINGLE, script)]

    turns = []
    for i, pos in enumerate(positions):
        end = positions[i + 1] if i + 1 < len(positions) else len(script)
        chunk = script[pos:end].strip()
        speaker = chunk[0]
        text = chunk[2:].strip()
        if not text:
            continue
        turns.append((VOICE_MALE if speaker == "M" else VOICE_FEMALE, text))
    return turns or [(VOICE_SINGLE, script)]


def chunk_text(text: str, limit: int = MAX_CHARS) -> list[str]:
    """
    Cắt văn bản thành đoạn ngắn hơn giới hạn, ưu tiên cắt ở cuối câu.

    Cắt ở cuối câu giữ được ngữ điệu tự nhiên; chỉ cắt giữa câu khi một câu dài
    hơn giới hạn (hiếm với dữ liệu TOEIC).
    """
    if len(text) <= limit:
        return [text]

    chunks = []
    remaining = text
    while len(remaining) > limit:
        window = remaining[:limit]
        # Tìm dấu kết câu gần cuối nhất trong cửa sổ.
        cut = max(window.rfind(". "), window.rfind("? "), window.rfind("! "))
        if cut < limit * 0.4:
            # Không có dấu câu hợp lý thì cắt ở khoảng trắng cuối cùng.
            cut = window.rfind(" ")
        if cut <= 0:
            cut = limit
        chunks.append(remaining[: cut + 1].strip())
        remaining = remaining[cut + 1 :].strip()
    if remaining:
        chunks.append(remaining)
    return chunks


def fetch_tts(text: str, lang: str, out_file: Path, retries: int = 3) -> bool:
    """Tải một đoạn MP3 từ Google TTS, có thử lại khi lỗi mạng."""
    query = urllib.parse.urlencode(
        {"ie": "UTF-8", "client": "tw-ob", "tl": lang, "q": text}
    )
    url = f"https://translate.googleapis.com/translate_tts?{query}"

    for attempt in range(retries):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(request, timeout=30) as response:
                data = response.read()
            if len(data) < 500:
                raise ValueError(f"file quá nhỏ ({len(data)} byte)")
            out_file.write_bytes(data)
            return True
        except Exception as exc:  # noqa: BLE001
            if attempt == retries - 1:
                print(f"    LỖI: {type(exc).__name__}: {exc}"[:160])
                return False
            time.sleep(1.5 * (attempt + 1))
    return False


def concat_mp3(parts: list[Path], out_file: Path) -> bool:
    """Nối nhiều file MP3 thành một, dùng ffmpeg."""
    if len(parts) == 1:
        parts[0].replace(out_file)
        return True

    list_file = out_file.with_suffix(".list.txt")
    list_file.write_text(
        "\n".join(f"file '{p.name}'" for p in parts), encoding="utf-8"
    )
    cmd = [
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        str(list_file),
        "-c",
        "copy",
        str(out_file),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=out_file.parent)
    for p in parts:
        p.unlink(missing_ok=True)
    list_file.unlink(missing_ok=True)

    if result.returncode != 0:
        print(f"    ffmpeg lỗi: {result.stderr.strip()[:150]}")
        return False
    return out_file.exists() and out_file.stat().st_size > 0


def synthesize_script(script: str, out_file: Path) -> bool:
    """Sinh một file MP3 cho cả đoạn; hội thoại thì đổi giọng theo lượt nói."""
    turns = split_by_speaker(script)
    tmp_files = []

    for turn_index, (lang, text) in enumerate(turns):
        for chunk_index, chunk in enumerate(chunk_text(text)):
            tmp = out_file.with_suffix(f".t{turn_index}c{chunk_index}.mp3")
            if not fetch_tts(chunk, lang, tmp):
                for f in tmp_files:
                    f.unlink(missing_ok=True)
                tmp.unlink(missing_ok=True)
                return False
            tmp_files.append(tmp)
            time.sleep(0.25)  # giãn nhịp để không bị chặn

    return concat_mp3(tmp_files, out_file)


def main() -> int:
    force = "--force" in sys.argv
    check_only = "--check" in sys.argv
    only_part = None
    if "--only" in sys.argv:
        index = sys.argv.index("--only")
        if index + 1 < len(sys.argv):
            only_part = int(sys.argv[index + 1])

    stimuli = parse_ts_stimuli()
    if only_part:
        stimuli = [s for s in stimuli if s["part"] == only_part]

    print(f"Tìm thấy {len(stimuli)} đoạn cần đọc.")

    if check_only:
        dialogues = [s for s in stimuli if re.search(r"(^|\s)[MW]:", s["script"])]
        total_chars = sum(len(s["script"]) for s in stimuli)
        print(f"  hội thoại hai người: {len(dialogues)}")
        print(f"  tổng ký tự: {total_chars:,}")
        print(f"  ước lượng số request: {sum(len(chunk_text(s['script'])) for s in stimuli)}")
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest = {}
    made = 0
    skipped = 0
    failed = 0

    for index, item in enumerate(stimuli, start=1):
        out_file = OUT_DIR / f"{item['id']}.mp3"
        rel = f"audio/{item['id']}.mp3"

        if out_file.exists() and not force and out_file.stat().st_size > 0:
            skipped += 1
            manifest[item["id"]] = {
                "part": item["part"],
                "file": rel,
                "bytes": out_file.stat().st_size,
            }
            continue

        turns = split_by_speaker(item["script"])
        kind = "hội thoại" if len(turns) > 1 else "đơn"
        print(
            f"  [{index}/{len(stimuli)}] {item['id']} "
            f"(Part {item['part']}, {kind}, {len(item['script'])} ký tự)"
        )

        if synthesize_script(item["script"], out_file):
            made += 1
            manifest[item["id"]] = {
                "part": item["part"],
                "file": rel,
                "bytes": out_file.stat().st_size,
            }
        else:
            failed += 1
            out_file.unlink(missing_ok=True)

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    total_bytes = sum(m["bytes"] for m in manifest.values())
    print(f"\nXong: {made} tạo mới, {skipped} bỏ qua, {failed} lỗi.")
    print(f"Tổng dung lượng: {total_bytes / 1024 / 1024:.1f} MB")
    print(f"Manifest: {OUT_DIR / 'manifest.json'}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
