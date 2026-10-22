"""Small signed bearer tokens for the local teaching prototype."""
import hmac
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from flask import current_app

TOKEN_MAX_AGE_SECONDS = 8 * 60 * 60


def authenticate(username, password):
    expected_user = str(current_app.config.get('DEMO_USERNAME', 'demo'))
    expected_password = str(current_app.config.get('DEMO_PASSWORD', 'demo123'))
    return hmac.compare_digest(str(username or ''), expected_user) and hmac.compare_digest(str(password or ''), expected_password)


def issue_token(username):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'], salt='warranty-api-auth')
    return serializer.dumps({'username': username})


def validate_token(token):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'], salt='warranty-api-auth')
    try:
        payload = serializer.loads(token, max_age=TOKEN_MAX_AGE_SECONDS)
        return payload.get('username') == current_app.config.get('DEMO_USERNAME', 'demo')
    except (BadSignature, SignatureExpired, AttributeError, TypeError):
        return False
