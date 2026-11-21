# -*- coding: utf-8 -*-
"""
CAN BANG PHAN BO DAP AN PART 6, DONG THOI GIU 10 KIEU DOAN KHAC NHAU.

Van de sau buoc sua dau: Part 6 da het lo "dap an trung so thu tu cho trong"
(82,5% -> 2,5%) va 10 doan co 10 kieu khac nhau, NHUNG phan bo lech:
  A=8  B=15  C=13  D=4
Nguoi lam co the doan "B" va duoc 15/40 = 37,5%.

Muc tieu: dua ve gan 10/10/10/10, van giu rang buoc:
1. Khong doan nao co kieu A,B,C,D (lo ro nhat).
2. Moi doan mot kieu khac nhau.
3. Dap an dung theo NOI DUNG khong doi — chi doi VI TRI phuong an.

Cach lam: duyet tat ca to hop kieu co the cho 10 doan, cham diem theo do lech
phan bo, chon to hop tot nhat.

Cach dung:
  python scripts/balance-part6.py --dry-run
  python scripts/balance-part6.py
"""

import itertools
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
LETTERS = ["A", "B", "C", "D"]


def extract_balanced(text: str, open_idx: int, open_ch: str, close_ch: str) -> int:
    depth = 0
    i = open_idx
    while i < len(text):
        if text[i] == open_ch:
            depth += 1
        elif text[i] == close_ch:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def parse_choices(block: str) -> tuple[list[str] | None, bool]:
    """Tra ve (mang text, dung_dinh_dang_object)."""
    m = re.search(r"choices:\s*\[", block)
    if not m:
        return None, False
    open_idx = m.end() - 1
    close_idx = extract_balanced(block, open_idx, "[", "]")
    if close_idx < 0:
        return None, False
    body = block[open_idx + 1 : close_idx]

    if "letter:" in body:
        texts = []
        for cm in re.finditer(
            r"letter:\s*'[A-D]',\s*text:\s*((?:'(?:[^'\\]|\\.)*'\s*\+?\s*)+)", body, re.S
        ):
            pieces = re.findall(r"'((?:[^'\\]|\\.)*)'", cm.group(1))
            texts.append("".join(pieces))
        return (texts if len(texts) == 4 else None), True

    items = re.findall(r"((?:'(?:[^'\\]|\\.)*'\s*\+?\s*)+)", body)
    texts = ["".join(re.findall(r"'((?:[^'\\]|\\.)*)'", raw)) for raw in items]
    return (texts if len(texts) == 4 else None), False


def rebuild_choices(block: str, texts: list[str], uses_objects: bool) -> str:
    m = re.search(r"choices:\s*\[", block)
    if not m:
        return block
    open_idx = m.end() - 1
    close_idx = extract_balanced(block, open_idx, "[", "]")
    if close_idx < 0:
        return block

    if uses_objects:
        inner = "\n" + "\n".join(
            "        { letter: '%s', text: '%s' }," % (LETTERS[j], texts[j].replace("'", "\\'"))
            for j in range(4)
        ) + "\n      "
    else:
        inner = "\n" + "\n".join(
            "        '%s'," % texts[j].replace("'", "\\'") for j in range(4)
        ) + "\n      "
    return block[:open_idx] + "[" + inner + "]" + block[close_idx + 1 :]


def main() -> int:
    dry = "--dry-run" in sys.argv

    groups = []  # [{sid, path, questions: [{id,start,end,blank,answer,texts,uses_objects}]}]

    for path in sorted(DATA_DIR.glob("part6*.ts")):
        if path.name.endswith(".test.ts"):
            continue
        text = path.read_text(encoding="utf-8")
        starts = [(m.group(1), m.start()) for m in re.finditer(r"id:\s*'(p6-\d+)',", text)]

        for i, (qid, start) in enumerate(starts):
            end = starts[i + 1][1] if i + 1 < len(starts) else len(text)
            block = text[start:end]

            sm = re.search(r"stimulusId:\s*'(g-p6-\d+)'", block)
            bm = re.search(r"\((\d)\)", block)
            am = re.search(r"answer:\s*'([A-D])'", block)
            if not (sm and bm and am):
                continue

            texts, uses_objects = parse_choices(block)
            if not texts:
                continue

            sid = sm.group(1)
            existing = next((g for g in groups if g["sid"] == sid), None)
            if existing is None:
                existing = {"sid": sid, "path": path, "questions": []}
                groups.append(existing)
            existing["questions"].append(
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

    for g in groups:
        g["questions"].sort(key=lambda q: q["blank"])

    print("Tim thay %d doan Part 6.\n" % len(groups))

    # Thu cac kieu cho tung doan, tim to hop cho phan bo deu nhat.
    # Moi doan co the nhan bat ky kieu nao trong 4^4 = 256 kieu (tru ABCD),
    # nhung de giai nhanh: voi moi doan, sinh danh sach kieu ung vien va
    # so lan trung voi so thu tu cho trong. Dung quy hoach dong tham lam.
    candidates = []
    for g in groups:
        n = len(g["questions"])
        opts = []
        for combo in itertools.product([0, 1, 2, 3], repeat=n):
            pattern = [
                LETTERS[(LETTERS.index(g["questions"][i]["answer"]) + combo[i]) % 4]
                for i in range(n)
            ]
            key = "".join(pattern)
            if key == "ABCD":
                continue
            leaks = sum(1 for i, a in enumerate(pattern) if i < 4 and a == LETTERS[i])
            opts.append((combo, key, leaks))
        # Sap theo it trung truoc, nhung giu da dang.
        opts.sort(key=lambda x: (x[2], x[1]))
        candidates.append(opts)

    # Tham lam: chon cho tung doan kieu it trung nhat ma chua ai dung va giup
    # can bang phan bo nhat.
    counts = {L: 0 for L in LETTERS}
    used = set()
    chosen = []

    for g, opts in zip(groups, candidates):
        best = None
        best_score = None
        for combo, key, leaks in opts:
            if key in used:
                continue
            if leaks > 1:
                continue
            # Cham diem: uu tien kieu lam phan bo deu hon.
            trial = dict(counts)
            for a in key:
                trial[a] += 1
            score = (leaks, max(trial.values()) - min(trial.values()))
            if best_score is None or score < best_score:
                best_score = score
                best = (combo, key, leaks)
            if leaks == 0 and best_score is not None and best_score[1] <= 2:
                break

        if best is None:
            print("  %s: khong tim duoc kieu phu hop" % g["sid"])
            continue

        combo, key, leaks = best
        used.add(key)
        for a in key:
            counts[a] += 1
        chosen.append((g, combo))
        print("  %s -> %s (trung %d)" % (g["sid"], key, leaks))

    print("\nPhan bo du kien: " + " ".join("%s=%d" % (L, counts[L]) for L in LETTERS))

    if dry:
        print("(che do --dry-run, khong ghi file)")
        return 0

    # Ap dung: sua tung cau theo combo da chon.
    by_path: dict[Path, list] = {}
    for g, combo in chosen:
        for i, q in enumerate(g["questions"]):
            old_idx = LETTERS.index(q["answer"])
            new_idx = (old_idx + combo[i]) % 4
            if old_idx == new_idx:
                continue
            by_path.setdefault(g["path"], []).append((q, old_idx, new_idx))

    fixed = 0
    for path, edits in by_path.items():
        text = path.read_text(encoding="utf-8")
        for q, old_idx, new_idx in sorted(edits, key=lambda e: -e[0]["start"]):
            block = text[q["start"] : q["end"]]

            texts = q["texts"][:]
            moved = texts.pop(old_idx)
            texts.insert(new_idx, moved)

            new_block = rebuild_choices(block, texts, q["uses_objects"])
            if new_block == block:
                print("  KHONG KHOP: %s" % q["id"])
                continue

            new_block = new_block.replace(
                "answer: '%s'" % q["answer"], "answer: '%s'" % LETTERS[new_idx], 1
            )

            order = list(range(4))
            moved_item = order.pop(old_idx)
            order.insert(new_idx, moved_item)
            mapping = {LETTERS[old]: LETTERS[new] for new, old in enumerate(order)}

            def swap(match: re.Match, mp=mapping) -> str:
                return mp.get(match.group(0), match.group(0))

            for field in ("explanation", "translation"):
                fm = re.search(rf"{field}:\s*\n?((?:\s*'.*?'\s*\+?\s*\n?)+)", new_block)
                if not fm:
                    continue
                old_field = fm.group(1)
                new_field = re.sub(r"(?<![A-Za-z])[A-D](?![A-Za-z])", swap, old_field)
                new_block = new_block.replace(old_field, new_field, 1)

            text = text[: q["start"]] + new_block + text[q["end"] :]
            fixed += 1

        path.write_text(text, encoding="utf-8")

    print("\nXong: %d cau da sua." % fixed)
    return 0


if __name__ == "__main__":
    sys.exit(main())
