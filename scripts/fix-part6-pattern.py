# -*- coding: utf-8 -*-
"""
XOA LOI "DAP AN TRUNG SO THU TU CHO TRONG" O PART 6.

Van de: 8/10 doan Part 6 co dap an dung dung thu tu A, B, C, D cho cac cho trong
(1), (2), (3), (4). Nguoi lam chi can doc so thu tu cho trong la biet dap an ma
khong can doc tieng Anh. Doan mu la 25%, quy tac nay cho 82,5%.

Cach sua: XOAY vong thu tu cac phuong an trong tung cau, roi cap nhat `answer`
va moi chu cai duoc nhac trong `explanation`/`translation`. Noi dung tieng Anh
khong doi mot chu — chi doi VI TRI.

Hai dinh dang duoc ho tro:
- `part6.ts`:   choices: [{ letter: 'A', text: '...' }, ...]
- `part6b.ts`:  choices: ['...', '...', '...', '...']  (thu tu la A, B, C, D)

Cach dung:
  python scripts/fix-part6-pattern.py --dry-run   # xem truoc
  python scripts/fix-part6-pattern.py            # ghi that
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
LETTERS = ["A", "B", "C", "D"]


def spans(text: str, pattern: str) -> list[tuple[int, int]]:
    """Tra ve [(start, end)] cua tung khoi khop, end la vi tri ngay sau khoi."""
    out = []
    for m in re.finditer(pattern, text):
        out.append((m.start(), m.end()))
    return out


def extract_balanced(text: str, open_idx: int, open_ch: str, close_ch: str) -> int:
    """Tim vi tri dong ngoac tuong ung, bat dau tu `open_idx` (tro vao open_ch)."""
    depth = 0
    i = open_idx
    while i < len(text):
        ch = text[i]
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def parse_choices_objects(block: str) -> list[str] | None:
    """Dinh dang `{ letter: 'A', text: '...' }` -> tra ve mang text."""
    m = re.search(r"choices:\s*\[", block)
    if not m:
        return None
    open_idx = m.end() - 1
    close_idx = extract_balanced(block, open_idx, "[", "]")
    if close_idx < 0:
        return None
    body = block[open_idx + 1 : close_idx]

    texts = []
    for cm in re.finditer(
        r"letter:\s*'[A-D]',\s*text:\s*((?:'(?:[^'\\]|\\.)*'\s*\+?\s*)+)",
        body,
        re.S,
    ):
        pieces = re.findall(r"'((?:[^'\\]|\\.)*)'", cm.group(1))
        texts.append("".join(pieces))
    return texts if len(texts) == 4 else None


def parse_choices_strings(block: str) -> list[str] | None:
    """Dinh dang `['a', 'b', 'c', 'd']` -> tra ve mang text."""
    m = re.search(r"choices:\s*\[", block)
    if not m:
        return None
    open_idx = m.end() - 1
    close_idx = extract_balanced(block, open_idx, "[", "]")
    if close_idx < 0:
        return None
    body = block[open_idx + 1 : close_idx]
    if "letter:" in body:
        return None
    items = re.findall(r"((?:'(?:[^'\\]|\\.)*'\s*\+?\s*)+)", body)
    texts = []
    for raw in items:
        pieces = re.findall(r"'((?:[^'\\]|\\.)*)'", raw)
        texts.append("".join(pieces))
    return texts if len(texts) == 4 else None


def rebuild_choices(block: str, texts: list[str], uses_objects: bool) -> str:
    """Tao lai khoi `choices: [...]` voi thu tu moi."""
    m = re.search(r"choices:\s*\[", block)
    if not m:
        return block
    open_idx = m.end() - 1
    close_idx = extract_balanced(block, open_idx, "[", "]")
    if close_idx < 0:
        return block

    if uses_objects:
        inner = "\n" + "\n".join(
            "        { letter: '%s', text: '%s' },"
            % (LETTERS[j], texts[j].replace("'", "\\'"))
            for j in range(4)
        ) + "\n      "
    else:
        inner = "\n" + "\n".join(
            "        '%s'," % texts[j].replace("'", "\\'") for j in range(4)
        ) + "\n      "

    return block[:open_idx] + "[" + inner + "]" + block[close_idx + 1 :]


def main() -> int:
    dry = "--dry-run" in sys.argv
    files = [p for p in sorted(DATA_DIR.glob("part6*.ts")) if not p.name.endswith(".test.ts")]

    total_fixed = 0
    total_skipped = 0
    # Theo doi cac kieu da dung trong TOAN BO Part 6, de khong doan duoc.
    meta: dict = {}

    for path in files:
        text = path.read_text(encoding="utf-8")
        starts = [(m.group(1), m.start()) for m in re.finditer(r"id:\s*'(p6-\d+)',", text)]
        if not starts:
            continue

        print("\n" + path.name)

        groups: dict[str, list[dict]] = {}
        for i, (qid, start) in enumerate(starts):
            end = starts[i + 1][1] if i + 1 < len(starts) else len(text)
            block = text[start:end]

            sm = re.search(r"stimulusId:\s*'(g-p6-\d+)'", block)
            bm = re.search(r"\((\d)\)", block)
            am = re.search(r"answer:\s*'([A-D])'", block)
            if not (sm and bm and am):
                continue

            texts = parse_choices_objects(block)
            uses_objects = texts is not None
            if texts is None:
                texts = parse_choices_strings(block)
            if texts is None:
                continue

            groups.setdefault(sm.group(1), []).append(
                {
                    "id": qid,
                    "start": start,
                    "end": end,
                    "blank": int(bm.group(1)),
                    "answer": am.group(1),
                    "texts": texts,
                    "uses_objects": uses_objects,
                }
            )

        edits = []
        for sid, qs in sorted(groups.items()):
            qs.sort(key=lambda q: q["blank"])
            pattern = [q["answer"] for q in qs]
            leaks = sum(1 for i, a in enumerate(pattern) if i < 4 and a == LETTERS[i])
            preview = " ".join("(%d)%s" % (q["blank"], q["answer"]) for q in qs)
            print("  %s: %s  -> trung %d/%d" % (sid, preview, leaks, len(qs)))

            if leaks < 2:
                total_skipped += 1
                print("       bo qua")
                continue

            # Tim cach xoay TOT NHAT cho tung cau trong doan, dong thoi tranh
            # lap lai cung mot kieu voi cac doan khac trong file.
            #
            # Vi sao can tranh lap: neu moi doan deu ra B,C,D,A thi nguoi lam chi
            # can nho mot kieu la lam duoc ca 10 doan. Phai lam moi doan MOT KIEU
            # KHAC NHAU, va cung tranh kieu A,B,C,D goc.
            import itertools

            used_patterns = meta.setdefault("used_patterns", set())
            best_combo = None
            best_leaks = 99
            best_pattern = None

            for combo in itertools.product([0, 1, 2, 3], repeat=len(qs)):
                trial = [
                    LETTERS[(LETTERS.index(q["answer"]) + combo[i]) % 4]
                    for i, q in enumerate(qs)
                ]
                pattern_key = "".join(trial)
                # Loai kieu A,B,C,D va kieu da dung o doan khac.
                if pattern_key == "ABCD" or pattern_key in used_patterns:
                    continue
                tleaks = sum(1 for i, a in enumerate(trial) if i < 4 and a == LETTERS[i])
                if tleaks < best_leaks:
                    best_leaks = tleaks
                    best_combo = combo
                    best_pattern = pattern_key
                if tleaks == 0 and best_combo is not None:
                    break

            if best_combo is None:
                print("       khong tim duoc kieu chua dung, giu nguyen")
                total_skipped += 1
                continue

            combo = best_combo
            used_patterns.add(best_pattern)
            print("       xoay %s -> %s (con %d trung)" % (list(combo), best_pattern, best_leaks))

            for i, q in enumerate(qs):
                old_idx = LETTERS.index(q["answer"])
                new_idx = (old_idx + combo[i]) % 4
                if old_idx == new_idx:
                    continue

                texts = q["texts"][:]
                moved = texts.pop(old_idx)
                texts.insert(new_idx, moved)

                block = text[q["start"] : q["end"]]
                new_block = rebuild_choices(block, texts, q["uses_objects"])
                if new_block == block:
                    print("       KHONG KHOP: %s" % q["id"])
                    continue

                new_block = new_block.replace(
                    "answer: '%s'" % q["answer"], "answer: '%s'" % LETTERS[new_idx], 1
                )

                # Doi chu cai trong explanation/translation theo dung phep xoay.
                # old_idx -> new_idx nghia la: chu cai cu o vi tri old_idx gio nam
                # o new_idx, va cac phuong an khac dich tuong ung.
                mapping = {}
                for k in range(4):
                    # Vi tri cu k -> vi tri moi: neu k == old_idx thi new_idx,
                    # con lai giu thu tu tuong doi sau khi chen.
                    if k == old_idx:
                        mapping[LETTERS[k]] = LETTERS[new_idx]
                    else:
                        # Dich cac phuong an con lai cho khong trung.
                        shifted = k if k < new_idx else k + 1
                        if k > old_idx:
                            shifted -= 1
                        mapping[LETTERS[k]] = LETTERS[(k - (1 if k > old_idx else 0) + (1 if k >= new_idx else 0)) % 4]

                # Don gian va dung: tinh lai anh xa bang cach mo phong phep xoay.
                order = list(range(4))
                moved_item = order.pop(old_idx)
                order.insert(new_idx, moved_item)
                mapping = {LETTERS[old]: LETTERS[new] for new, old in enumerate(order)}

                def swap(match: re.Match) -> str:
                    return mapping.get(match.group(0), match.group(0))

                for field in ("explanation", "translation"):
                    fm = re.search(rf"{field}:\s*\n?((?:\s*'.*?'\s*\+?\s*\n?)+)", new_block)
                    if not fm:
                        continue
                    old_field = fm.group(1)
                    new_field = re.sub(r"(?<![A-Za-z])[A-D](?![A-Za-z])", swap, old_field)
                    new_block = new_block.replace(old_field, new_field, 1)

                edits.append((q["start"], q["end"], new_block))
                total_fixed += 1

        if not dry and edits:
            for start, end, new_block in sorted(edits, key=lambda e: -e[0]):
                text = text[:start] + new_block + text[end:]
            path.write_text(text, encoding="utf-8")

    print("\nXong: %d cau da sua, %d doan bo qua." % (total_fixed, total_skipped))
    if dry:
        print("(che do --dry-run, khong ghi file)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
