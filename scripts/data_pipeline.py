"""Three-phase quality pipeline for issue-description training data.

Usage: python scripts/data_pipeline.py
Phases: load -> validate (5 checks) -> normalize/export.
Only Python standard library is required.
"""
from __future__ import annotations
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "issue_training.csv"
OUTPUT = ROOT / "data" / "issue_training_clean.csv"
ALLOWED_LABELS = {"MAN_HINH", "NGUON", "PIN"}


def load_rows(path: Path = SOURCE) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def validate_rows(rows: list[dict[str, str]]) -> list[str]:
    """Return all validation errors; implements five explicit quality checks."""
    errors: list[str] = []
    if not rows:
        errors.append("Q1: Dataset không được rỗng.")
    required = {"text", "label"}
    if rows and not required.issubset(rows[0].keys()):
        errors.append("Q2: Thiếu cột bắt buộc text/label.")
        return errors
    normalized_texts: list[str] = []
    for index, row in enumerate(rows, start=2):
        text = (row.get("text") or "").strip()
        label = (row.get("label") or "").strip()
        if not text:
            errors.append(f"Q3: Dòng {index} có mô tả rỗng.")
        if label not in ALLOWED_LABELS:
            errors.append(f"Q4: Dòng {index} có nhãn không hợp lệ: {label!r}.")
        normalized_texts.append(re.sub(r"\s+", " ", text.casefold()))
    if len(normalized_texts) != len(set(normalized_texts)):
        errors.append("Q5: Có mô tả trùng lặp sau chuẩn hóa.")
    return errors


def normalize_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    return [{"text": re.sub(r"\s+", " ", row["text"]).strip(),
             "label": row["label"].strip().upper()} for row in rows]


def run_pipeline(source: Path = SOURCE, output: Path = OUTPUT) -> dict[str, int]:
    # Phase 1 — Load
    rows = load_rows(source)
    # Phase 2 — Validate (5 quality checks)
    errors = validate_rows(rows)
    if errors:
        raise ValueError("\n".join(errors))
    # Phase 3 — Normalize and export
    cleaned = normalize_rows(rows)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerows(cleaned)
    return {"input_rows": len(rows), "output_rows": len(cleaned), "quality_checks": 5}


if __name__ == "__main__":
    summary = run_pipeline()
    print("PASS: pipeline 3 pha (load -> validate -> normalize/export)")
    print(f"PASS: {summary['quality_checks']} nhóm kiểm tra chất lượng")
    print(f"Số dòng đầu vào: {summary['input_rows']}")
    print(f"Số dòng đầu ra: {summary['output_rows']}")
    print(f"Tệp đầu ra: {OUTPUT.relative_to(ROOT)}")
