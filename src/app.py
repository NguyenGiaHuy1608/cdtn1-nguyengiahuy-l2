from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "CDTN1 - Hệ thống tiếp nhận và phân loại yêu cầu bảo hành"


if __name__ == "__main__":
    app.run(debug=True)
