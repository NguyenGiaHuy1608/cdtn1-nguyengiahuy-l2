from flask import Blueprint, jsonify, request
from src.errors.app_error import AppError
from src.services.customer_service import CustomerService
from src.services.ticket_service import TicketService

api=Blueprint('api',__name__,url_prefix='/api')
customers=CustomerService(); tickets=TicketService()

def error_response(error):
    return jsonify({'error':error.code,'message':error.message}), error.status_code

@api.get('/health')
def health(): return jsonify({'status':'ok'})

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

@api.get('/tickets')
def list_tickets(): return jsonify({'data':tickets.list()})

@api.post('/tickets')
def create_ticket():
    try: return jsonify({'data':tickets.create(request.get_json(silent=True))}),201
    except AppError as e: return error_response(e)
