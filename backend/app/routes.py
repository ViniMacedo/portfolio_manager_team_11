from flask import Blueprint, jsonify, request
from app.models import User, Portfolio, Transaction, Holding, ProductType, TransactionType
from app import db
from datetime import datetime
from decimal import Decimal

api = Blueprint('api', __name__)

# Helper functions to convert your models to JSON
def serialize_user(user):
    return {
        'id': user.id,
        'name': user.name,
        'balance': float(user.balance),
        'created_at': user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else None
    }

def serialize_portfolio(portfolio):
    return {
        'id': portfolio.id,
        'user_id': portfolio.user_id,
        'name': portfolio.name,
        'created_at': portfolio.created_at.isoformat() if portfolio.created_at else None
    }

def serialize_holding(holding):
    return {
        'id': holding.id,
        'portfolio_id': holding.portfolio_id,
        'product_symbol': holding.product_symbol,
        'qty': float(holding.qty),
        'avg_price': float(holding.avg_price),
        'current_price': float(holding.current_price),
        'last_updated': holding.last_updated.isoformat() if holding.last_updated else None,
        'product_type': holding.product_type.value if holding.product_type else None
    }

def serialize_transaction(transaction):
    return {
        'id': transaction.id,
        'portfolio_id': transaction.portfolio_id,
        'product_symbol': transaction.product_symbol,
        'qty': float(transaction.qty),
        'price': float(transaction.price),
        'product_type': transaction.product_type.value if transaction.product_type else None,
        'type': transaction.type.value if transaction.type else None,
        'transaction_date': transaction.transaction_date.isoformat() if transaction.transaction_date else None,
        'fee': float(transaction.fee) if transaction.fee else 0.0
    }

# TEST ENDPOINT - Start with this one!
@api.route('/test', methods=['GET'])
def test_api():
    """Test endpoint to verify API is working"""
    return jsonify({
        'message': 'Portfolio Manager API is working!',
        'status': 'success'
    })

# USER ENDPOINTS
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    user = User.query.get_or_404(user_id)
    return jsonify(serialize_user(user))

# PORTFOLIO ENDPOINTS
@api.route('/portfolios/user/<int:user_id>', methods=['GET'])
def get_user_portfolios(user_id):
    """Get all portfolios for a user"""
    portfolios = Portfolio.query.filter_by(user_id=user_id).all()
    return jsonify([serialize_portfolio(portfolio) for portfolio in portfolios])

# HOLDINGS ENDPOINTS
@api.route('/holdings/portfolio/<int:portfolio_id>', methods=['GET'])
def get_portfolio_holdings(portfolio_id):
    """Get all holdings for a portfolio"""
    holdings = Holding.query.filter_by(portfolio_id=portfolio_id).all()
    return jsonify([serialize_holding(holding) for holding in holdings])

# TRANSACTIONS ENDPOINTS
@api.route('/transactions/portfolio/<int:portfolio_id>', methods=['GET'])
def get_portfolio_transactions(portfolio_id):
    """Get all transactions for a portfolio"""
    transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).order_by(Transaction.transaction_date.desc()).all()
    return jsonify([serialize_transaction(transaction) for transaction in transactions])

# PORTFOLIO SUMMARY
@api.route('/portfolio-summary/<int:portfolio_id>', methods=['GET'])
def get_portfolio_summary(portfolio_id):
    """Get portfolio summary with calculated metrics"""
    portfolio = Portfolio.query.get_or_404(portfolio_id)
    holdings = Holding.query.filter_by(portfolio_id=portfolio_id).all()
    
    total_value = sum(float(h.qty) * float(h.current_price) for h in holdings)
    total_cost = sum(float(h.qty) * float(h.avg_price) for h in holdings)
    total_gain = total_value - total_cost
    total_gain_percent = (total_gain / total_cost * 100) if total_cost > 0 else 0
    
    # Simulate daily change (2.3% for demo)
    day_change = total_value * 0.023
    day_change_percent = 2.32
    
    return jsonify({
        'portfolio': serialize_portfolio(portfolio),
        'total_value': total_value,
        'total_cost': total_cost,
        'total_gain': total_gain,
        'total_gain_percent': round(total_gain_percent, 2),
        'day_change': day_change,
        'day_change_percent': day_change_percent,
        'holdings_count': len(holdings)
    })