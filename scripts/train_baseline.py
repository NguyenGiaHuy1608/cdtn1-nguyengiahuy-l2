"""Train a small Multinomial Naive Bayes baseline using only stdlib.

Run data_pipeline.py first. Output: models/issue_classifier.json
This is an educational baseline, not a production warranty decision system.
"""
from __future__ import annotations
import json
import math
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "issue_training_clean.csv"
MODEL = ROOT / "models" / "issue_classifier.json"
TOKEN_RE = re.compile(r"[a-zA-ZÀ-ỹ0-9]+", re.UNICODE)


def tokenize(text: str) -> list[str]:
    return [token.casefold() for token in TOKEN_RE.findall(text)]


def train(rows: list[dict[str, str]]) -> dict:
    if not rows:
        raise ValueError("Không có dữ liệu huấn luyện.")
    labels = Counter(row["label"] for row in rows)
    words: dict[str, Counter] = defaultdict(Counter)
    vocabulary: set[str] = set()
    for row in rows:
        tokens = tokenize(row["text"])
        words[row["label"]].update(tokens)
        vocabulary.update(tokens)
    return {
        "algorithm": "Multinomial Naive Bayes",
        "training_rows": len(rows),
        "labels": dict(labels),
        "vocabulary": sorted(vocabulary),
        "word_counts": {label: dict(counts) for label, counts in words.items()},
        "class_counts": dict(labels),
    }


def predict(model: dict, text: str) -> tuple[str, dict[str, float]]:
    vocab = set(model["vocabulary"])
    scores: dict[str, float] = {}
    total_docs = sum(model["class_counts"].values())
    for label, doc_count in model["class_counts"].items():
        counts = model["word_counts"][label]
        total_words = sum(counts.values())
        score = math.log(doc_count / total_docs)
        for token in tokenize(text):
            if token in vocab:
                score += math.log((counts.get(token, 0) + 1) / (total_words + len(vocab)))
        scores[label] = score
    return max(scores, key=scores.get), scores


def main() -> None:
    import csv
    if not DATA.exists():
        raise SystemExit("Chưa có dữ liệu sạch. Chạy: python scripts/data_pipeline.py")
    with DATA.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    model = train(rows)
    MODEL.parent.mkdir(parents=True, exist_ok=True)
    MODEL.write_text(json.dumps(model, ensure_ascii=False, indent=2), encoding="utf-8")
    print("PASS: huấn luyện mô hình cơ sở hoàn tất")
    print(f"Thuật toán: {model['algorithm']}")
    print(f"Số mẫu: {model['training_rows']}; số nhãn: {len(model['class_counts'])}")
    for sample in ["Màn hình nhấp nháy", "Máy không lên nguồn", "Pin tụt nhanh"]:
        label, _ = predict(model, sample)
        print(f"Dự đoán: {sample} -> {label}")
    print(f"Mô hình: {MODEL.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
