from flask import Flask, jsonify, render_template
from src.db import init_db
from src.routes.api import api

def create_app(test_config=None):
    app=Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.update(test_config or {})
    if app.config.get('INIT_DB', True): init_db(seed=True)
    app.register_blueprint(api)
    @app.get('/')
    def home(): return render_template('index.html')
    @app.errorhandler(404)
    def not_found(_): return jsonify({'error':'KHONG_TIM_THAY','message':'Không tìm thấy tài nguyên.'}),404
    return app

app=create_app()
if __name__ == '__main__': app.run(debug=True, port=5000)
