# -*- coding: utf-8 -*-
"""
SINH FILE AM THANH CHO PART 1-4.

Hai nguon giong, tu chon theo bien moi truong:

1. ELEVENLABS (neu co key) - giong neural tu nhien nhat, co hai giong khac nhau
   cho hoi thoai. Dat `ELEVENLABS_API_KEY` trong file `.env.local` hoac bien moi
   truong. Goi free chi co 10,000 credits (1 credit = 1 ky tu), nen script nay
   uu tien sinh cac phan quan trong truoc va dung lai khi het credits.

2. GOOGLE TRANSLATE TTS (mac dinh, mien phi) - giong may, nhung khong gioi han
   so luong dang ke. Dung khi khong co key ElevenLabs hoac khi da het credits.

Vi sao can file MP3 sinh san thay vi de trinh duyet doc:
- Giong may cua trinh duyet doc deu deu, khong ngat nghi theo dau cau, va khac
  nhau tren tung may. File MP3 thi moi nguoi nghe giong nhau, phat duoc offline.
- Hoi thoai hai nguoi can HAI GIONG KHAC NHAU. Script nay doi giong theo dung
  nhan `M:` / `W:` trong du lieu.

Cach dung:
  python scripts/generate-audio.py                  # sinh tat ca con thieu
  python scripts/generate-audio.py --force          # sinh lai tat ca
  python scripts/generate-audio.py --only 3         # chi Part 3
  python scripts/generate-audio.py --check          # chi kiem, khong tai
  python scripts/generate-audio.py --engine eleven  # bat buoc dung ElevenLabs
  python scripts/generate-audio.py --budget 9984    # gioi han so credits

Dau ra: public/audio/<stimulusId>.mp3 + public/audio/manifest.json
Manifest ghi ro tung file sinh bang engine nao, de biet file nao con la giong may.

Ban quyen: noi dung doc do chinh du an viet; khong chua am thanh nao cua ETS.
"""

import json
import os
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

# Google TTS tu choi chuoi qua dai (thuc nghiem: >200 ky tu tra 400).
MAX_CHARS_GOOGLE = 180
# ElevenLabs nhan van ban dai hon nhieu, nhung cat nho giup giam rui ro timeout.
MAX_CHARS_ELEVEN = 2500

# Giong Google: en-GB cho nam, en-US cho nu - nghe ro la hai nguoi.
GOOGLE_MALE = "en-GB"
GOOGLE_FEMALE = "en"
GOOGLE_SINGLE = "en"

# Giong ElevenLabs: chon trong danh sach free tier (da kiem bang API).
# `Roger` nam tinh, `Sarah` nu ro rang - de phan biet hai nguoi trong hoi thoai.
ELEVEN_MALE = "CwhRBWXzGAHq8TQ4Fs17"  # Roger
ELEVEN_FEMALE = "EXAVITQu4vr4xnSDxMaL"  # Sarah
ELEVEN_SINGLE = "EXAVITQu4vr4xnSDxMaL"  # Sarah - giong doc don de nghe
ELEVEN_MODEL = "eleven_turbo_v2_5"  # re credits nhat ma van tu nhien

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def load_env_file() -> None:
    """Doc `.env.local` neu co, de khong phai xuat bien moi truong bang tay."""
    env_path = ROOT / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def eleven_key() -> str | None:
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    return key or None


def eleven_remaining(key: str) -> int | None:
    """So credits con lai, hoac None neu khong doc duoc."""
    try:
        request = urllib.request.Request(
            "https://api.elevenlabs.io/v1/user/subscription",
            headers={"xi-api-key": key},
        )
        with urllib.request.urlopen(request, timeout=25) as response:
            data = json.loads(response.read())
        return int(data["character_limit"]) - int(data["character_count"])
    except Exception:  # noqa: BLE001
        return None


def parse_ts_stimuli() -> list[dict]:
    """Doc cac file part*.ts va rut ra id + part + audioScript."""
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


def split_by_speaker(script: str, engine: str) -> list[tuple[str, str]]:
    """Tach loi thoai thanh [(ma giong, cau)] theo nhan M:/W:."""
    if engine == "eleven":
        male, female, single = ELEVEN_MALE, ELEVEN_FEMALE, ELEVEN_SINGLE
    else:
        male, female, single = GOOGLE_MALE, GOOGLE_FEMALE, GOOGLE_SINGLE

    if not re.search(r"(^|\s)[MW]:", script):
        return [(single, script)]

    positions = [m.start() for m in re.finditer(r"(?:^|(?<=\s))[MW]:", script)]
    if not positions:
        return [(single, script)]

    turns = []
    for i, pos in enumerate(positions):
        end = positions[i + 1] if i + 1 < len(positions) else len(script)
        chunk = script[pos:end].strip()
        speaker = chunk[0]
        text = chunk[2:].strip()
        if not text:
            continue
        turns.append((male if speaker == "M" else female, text))
    return turns or [(single, script)]


def chunk_text(text: str, limit: int) -> list[str]:
    """Cat van ban thanh doan ngan hon gioi han, uu tien cat o cuoi cau."""
    if len(text) <= limit:
        return [text]

    chunks = []
    remaining = text
    while len(remaining) > limit:
        window = remaining[:limit]
        cut = max(window.rfind(". "), window.rfind("? "), window.rfind("! "))
        if cut < limit * 0.4:
            cut = window.rfind(" ")
        if cut <= 0:
            cut = limit
        chunks.append(remaining[: cut + 1].strip())
        remaining = remaining[cut + 1 :].strip()
    if remaining:
        chunks.append(remaining)
    return chunks


def fetch_google(text: str, lang: str, out_file: Path, retries: int = 3) -> bool:
    """Tai mot doan MP3 tu Google Translate TTS."""
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
                raise ValueError(f"file qua nho ({len(data)} byte)")
            out_file.write_bytes(data)
            return True
        except Exception as exc:  # noqa: BLE001
            if attempt == retries - 1:
                print(f"    LOI: {type(exc).__name__}: {exc}"[:160])
                return False
            time.sleep(1.5 * (attempt + 1))
    return False


def fetch_eleven(text: str, voice_id: str, out_file: Path, key: str) -> tuple[bool, str]:
    """
    Sinh mot doan MP3 bang ElevenLabs.

    Tra ve (thanh_cong, ly_do). Khi het credits tra ve ly do `quota` de vong lap
    ngoai biet dung lai thay vi tiep tuc goi va that bai 80 lan.
    """
    payload = json.dumps(
        {
            "text": text,
            "model_id": ELEVEN_MODEL,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
                "style": 0.0,
                "use_speaker_boost": True,
            },
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        data=payload,
        headers={
            "xi-api-key": key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            data = response.read()
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")[:200]
        if exc.code == 402:
            return False, "quota"
        if exc.code == 401:
            return False, "key"
        return False, f"HTTP {exc.code}: {body}"
    except Exception as exc:  # noqa: BLE001
        return False, f"{type(exc).__name__}: {exc}"

    if len(data) < 500:
        return False, f"file qua nho ({len(data)} byte)"
    out_file.write_bytes(data)
    return True, "ok"


def concat_mp3(parts: list[Path], out_file: Path) -> bool:
    """Noi nhieu file MP3 thanh mot, dung ffmpeg."""
    if len(parts) == 1:
        parts[0].replace(out_file)
        return True

    list_file = out_file.with_suffix(".list.txt")
    list_file.write_text("\n".join(f"file '{p.name}'" for p in parts), encoding="utf-8")
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0",
        "-i", str(list_file.resolve()),
        "-c", "copy", str(out_file.resolve()),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=out_file.parent)
    for p in parts:
        p.unlink(missing_ok=True)
    list_file.unlink(missing_ok=True)

    if result.returncode != 0:
        print(f"    ffmpeg loi: {result.stderr.strip()[:150]}")
        return False
    return out_file.exists() and out_file.stat().st_size > 0


def synthesize(item: dict, out_file: Path, engine: str, key: str | None) -> tuple[bool, str, int]:
    """
    Sinh mot file MP3 cho ca doan.

    Tra ve (thanh_cong, ly_do, so_ky_tu_da_dung).
    """
    turns = split_by_speaker(item["script"], engine)
    limit = MAX_CHARS_ELEVEN if engine == "eleven" else MAX_CHARS_GOOGLE
    tmp_files = []
    used_chars = 0

    for turn_index, (voice_or_lang, text) in enumerate(turns):
        for chunk_index, chunk in enumerate(chunk_text(text, limit)):
            tmp = out_file.with_suffix(f".t{turn_index}c{chunk_index}.mp3")

            if engine == "eleven":
                ok, reason = fetch_eleven(chunk, voice_or_lang, tmp, key or "")
                if ok:
                    used_chars += len(chunk)
                else:
                    for f in tmp_files:
                        f.unlink(missing_ok=True)
                    tmp.unlink(missing_ok=True)
                    return False, reason, used_chars
            else:
                if not fetch_google(chunk, voice_or_lang, tmp):
                    for f in tmp_files:
                        f.unlink(missing_ok=True)
                    tmp.unlink(missing_ok=True)
                    return False, "fetch", used_chars
                time.sleep(0.25)

            tmp_files.append(tmp)

    ok = concat_mp3(tmp_files, out_file)
    return ok, ("ok" if ok else "concat"), used_chars


def main() -> int:
    load_env_file()

    force = "--force" in sys.argv
    check_only = "--check" in sys.argv
    only_part = None
    if "--only" in sys.argv:
        index = sys.argv.index("--only")
        if index + 1 < len(sys.argv):
            only_part = int(sys.argv[index + 1])

    # Thu tu sinh: Part 3 (hoi thoai, can hai giong) truoc, roi Part 4, 1, 2.
    # Ly do: hoi thoai huong loi nhieu nhat tu giong tu nhien; Part 2 ngan va
    # de nghe bang giong may hon.
    priority = [3, 4, 1, 2]

    budget = None
    if "--budget" in sys.argv:
        index = sys.argv.index("--budget")
        if index + 1 < len(sys.argv):
            budget = int(sys.argv[index + 1])

    stimuli = parse_ts_stimuli()
    if only_part:
        stimuli = [s for s in stimuli if s["part"] == only_part]
    else:
        stimuli.sort(key=lambda s: priority.index(s["part"]) if s["part"] in priority else 99)

    key = eleven_key()
    remaining = eleven_remaining(key) if key else None

    if check_only:
        total = sum(len(s["script"]) for s in stimuli)
        dialogues = [s for s in stimuli if re.search(r"(^|\s)[MW]:", s["script"])]
        print(f"Doan can doc: {len(stimuli)}")
        print(f"  hoi thoai hai nguoi: {len(dialogues)}")
        print(f"  tong ky tu: {total:,}")
        print(f"ElevenLabs key: {'CO' if key else 'khong'}")
        if remaining is not None:
            print(f"  credits con lai: {remaining:,}")
        if budget is not None:
            print(f"  gioi han cho phep dung: {budget:,}")
        return 0

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Doan can doc: {len(stimuli)}")
    print(f"ElevenLabs: {'CO key, con ' + format(remaining, ',') + ' credits' if remaining is not None else 'khong co key -> dung Google TTS'}")

    manifest = {}
    if (OUT_DIR / "manifest.json").exists():
        try:
            manifest = json.loads((OUT_DIR / "manifest.json").read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            manifest = {}

    made = 0
    skipped = 0
    failed = 0
    spent = 0
    quota_hit = False

    for index, item in enumerate(stimuli, start=1):
        out_file = OUT_DIR / f"{item['id']}.mp3"
        rel = f"audio/{item['id']}.mp3"
        size = len(item["script"])

        if out_file.exists() and not force and out_file.stat().st_size > 0:
            skipped += 1
            manifest.setdefault(item["id"], {
                "part": item["part"],
                "file": rel,
                "bytes": out_file.stat().st_size,
                "engine": "unknown",
            })
            continue

        # Quyet dinh engine cho tung doan: uu tien ElevenLabs neu con du credits.
        engine = "google"
        if key and not quota_hit:
            if budget is not None:
                if spent + size <= budget:
                    engine = "eleven"
            elif remaining is not None:
                if spent + size <= remaining:
                    engine = "eleven"

        turns = split_by_speaker(item["script"], engine)
        kind = "hoi thoai" if len(turns) > 1 else "don"
        print(f"  [{index}/{len(stimuli)}] {item['id']} (P{item['part']}, {kind}, {size} ky tu) -> {engine}")

        ok, reason, used = synthesize(item, out_file, engine, key)
        spent += used

        if ok:
            made += 1
            manifest[item["id"]] = {
                "part": item["part"],
                "file": rel,
                "bytes": out_file.stat().st_size,
                "engine": engine,
            }
        else:
            if reason == "quota":
                quota_hit = True
                print("    HET CREDITS ElevenLabs - chuyen sang Google TTS cho phan con lai.")
                # Thu lai ngay bang Google de khong bo trong doan nay.
                ok2, reason2, _ = synthesize(item, out_file, "google", None)
                if ok2:
                    made += 1
                    manifest[item["id"]] = {
                        "part": item["part"],
                        "file": rel,
                        "bytes": out_file.stat().st_size,
                        "engine": "google",
                    }
                else:
                    failed += 1
                    out_file.unlink(missing_ok=True)
            elif reason == "key":
                print("    KEY KHONG HOP LE - dung lai.")
                return 2
            else:
                failed += 1
                print(f"    LOI: {reason}"[:160])
                out_file.unlink(missing_ok=True)

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )

    by_engine = {}
    for entry in manifest.values():
        by_engine[entry.get("engine", "unknown")] = by_engine.get(entry.get("engine", "unknown"), 0) + 1

    total_bytes = sum(m.get("bytes", 0) for m in manifest.values())
    print(f"\nXong: {made} tao moi, {skipped} bo qua, {failed} loi.")
    print(f"Theo engine: {by_engine}")
    print(f"Credits da dung lan nay: {spent:,}")
    if key:
        left = eleven_remaining(key)
        if left is not None:
            print(f"Credits con lai: {left:,}")
    print(f"Tong dung luong: {total_bytes / 1024 / 1024:.1f} MB")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())


