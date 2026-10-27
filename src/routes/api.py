from flask import Blueprint, jsonify, request
from src.errors.app_error import AppError
from src.services.customer_service import CustomerService
from src.services.ticket_service import TicketService
from src.services.catalog_service import CatalogService
from src.auth import authenticate, issue_token, validate_token

api=Blueprint('api',__name__,url_prefix='/api')
customers=CustomerService(); tickets=TicketService(); catalog=CatalogService()

def error_response(error):
    return jsonify({'error':error.code,'message':error.message}), error.status_code

@api.get('/health')
def health(): return jsonify({'status':'ok'})

@api.post('/login')
def login():
    payload = request.get_json(silent=True) or {}
    if not authenticate(payload.get('username'), payload.get('password')):
        return jsonify({'error': 'THONG_TIN_DANG_NHAP_SAI', 'message': 'Tên đăng nhập hoặc mật khẩu không đúng.'}), 401
    return jsonify({'data': {'token': issue_token(payload.get('username')), 'token_type': 'Bearer', 'expires_in': 28800}})

@api.before_request
def require_bearer_token():
    # Health and login are public; all business API endpoints require a valid token.
    if request.endpoint in {'api.health', 'api.login'}:
        return None
    authorization = request.headers.get('Authorization', '')
    scheme, _, token = authorization.partition(' ')
    if scheme.lower() != 'bearer' or not token or not validate_token(token):
        return jsonify({'error': 'TOKEN_KHONG_HOP_LE', 'message': 'Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'}), 401
    return None

@api.get('/customers')
def list_customers():
    phone = request.args.get('phone', '').strip()
    if phone:
        try:
            return jsonify({'data': customers.find_by_phone(phone)})
        except AppError as e:
            return error_response(e)
    return jsonify({'data': customers.list()})

@api.post('/customers')
def create_customer():
    try: return jsonify({'data':customers.create(request.get_json(silent=True))}),201
    except AppError as e: return error_response(e)

@api.put('/customers/<int:customer_id>')
def update_customer(customer_id):
    try: return jsonify({'data': customers.update(customer_id, request.get_json(silent=True))})
    except AppError as e: return error_response(e)

@api.delete('/customers/<int:customer_id>')
def delete_customer(customer_id):
    try:
        customers.delete(customer_id)
        return jsonify({'data': {'deleted': True, 'customer_id': customer_id}})
    except AppError as e: return error_response(e)

@api.get('/tickets')
def list_tickets(): return jsonify({'data':tickets.list()})

@api.post('/tickets')
def create_ticket():
    try: return jsonify({'data':tickets.create(request.get_json(silent=True))}),201
    except AppError as e: return error_response(e)

@api.put('/tickets/<int:ticket_id>')
def update_ticket(ticket_id):
    try: return jsonify({'data': tickets.update(ticket_id, request.get_json(silent=True))})
    except AppError as e: return error_response(e)

@api.delete('/tickets/<int:ticket_id>')
def delete_ticket(ticket_id):
    try:
        tickets.delete(ticket_id)
        return jsonify({'data': {'deleted': True, 'ticket_id': ticket_id}})
    except AppError as e: return error_response(e)


@api.get('/devices')
def list_devices():
    customer_id = request.args.get('customer_id')
    try:
        return jsonify({'data': catalog.list_devices(customer_id)})
    except AppError as e:
        return error_response(e)


@api.post('/devices')
def create_device():
    try:
        return jsonify({'data': catalog.create_device(request.get_json(silent=True))}), 201
    except AppError as e:
        return error_response(e)

@api.get('/categories')
def list_categories():
    return jsonify({'data': catalog.list_categories()})

@api.get('/tickets/<int:ticket_id>')
def get_ticket(ticket_id):
    ticket = tickets.get_by_id(ticket_id)
    if not ticket:
        return jsonify({'error': 'PHIEU_KHONG_TON_TAI', 'message': 'Không tìm thấy phiếu bảo hành.'}), 404
    return jsonify({'data': ticket})
