class AppError(Exception):
    """Lỗi nghiệp vụ có mã ổn định; không phụ thuộc HTTP."""
    def __init__(self, code, message, status_code=400):
        super().__init__(message)
        self.code = code
        self.status_code = status_code
        self.message = message
