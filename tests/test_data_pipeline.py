import tempfile
import unittest
from pathlib import Path
from scripts.data_pipeline import validate_rows, normalize_rows, run_pipeline
from scripts.train_baseline import train, predict

class DataPipelineTests(unittest.TestCase):
    def test_valid_dataset_passes_five_checks(self):
        rows = [
            {"text": "Màn hình nhấp nháy", "label": "MAN_HINH"},
            {"text": "Máy không lên nguồn", "label": "NGUON"},
        ]
        self.assertEqual(validate_rows(rows), [])

    def test_invalid_label_is_rejected(self):
        self.assertTrue(any("Q4" in error for error in validate_rows([
            {"text": "Điện thoại lỗi", "label": "UNKNOWN"}
        ])))

    def test_duplicate_description_is_rejected(self):
        errors = validate_rows([
            {"text": "Màn hình lỗi", "label": "MAN_HINH"},
            {"text": "  MÀN HÌNH LỖI ", "label": "MAN_HINH"},
        ])
        self.assertTrue(any("Q5" in error for error in errors))

    def test_normalization_compacts_whitespace(self):
        self.assertEqual(normalize_rows([{"text": "  Pin   tụt nhanh ", "label": "pin"}]),
                         [{"text": "Pin tụt nhanh", "label": "PIN"}])

    def test_pipeline_exports_clean_csv(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "in.csv"
            output = Path(temp) / "out.csv"
            source.write_text('text,label\n"Màn hình lỗi",MAN_HINH\n', encoding="utf-8")
            summary = run_pipeline(source, output)
            self.assertEqual(summary["output_rows"], 1)
            self.assertTrue(output.exists())

    def test_baseline_model_predicts_known_class(self):
        model = train([
            {"text": "màn hình nứt màn hình sọc", "label": "MAN_HINH"},
            {"text": "máy không lên nguồn bật nguồn", "label": "NGUON"},
            {"text": "pin tụt nhanh pin yếu", "label": "PIN"},
        ])
        label, scores = predict(model, "màn hình sọc")
        self.assertEqual(label, "MAN_HINH")
        self.assertEqual(set(scores), {"MAN_HINH", "NGUON", "PIN"})

if __name__ == "__main__":
    unittest.main()
