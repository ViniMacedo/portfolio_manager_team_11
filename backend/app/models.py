from app import db
from datetime import datetime
from enum import Enum

class ProductType(str, Enum):
    STOCKS = "STOCKS"
    BONDS = "BONDS"
    CASH = "CASH"

class TransactionType(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    balance = db.Column(db.Numeric, nullable=False)
    portfolios = db.relationship('Portfolio', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'balance': float(self.balance) if self.balance else 0
        }

class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('Transaction', backref='portfolio', lazy=True)
    holdings = db.relationship('Holding', backref='portfolio', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    product_symbol = db.Column(db.String(255), nullable=False)
    qty = db.Column(db.Numeric, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    product_type = db.Column(db.Enum(ProductType), nullable=False)
    type = db.Column(db.Enum(TransactionType), nullable=False)
    transaction_date = db.Column(db.Date, nullable=False)
    fee = db.Column(db.Numeric, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'product_symbol': self.product_symbol,
            'qty': float(self.qty) if self.qty else 0,
            'price': float(self.price) if self.price else 0,
            'product_type': self.product_type.value,
            'type': self.type.value,
            'transaction_date': self.transaction_date.isoformat(),
            'fee': float(self.fee) if self.fee else 0
        }

class Holding(db.Model):
    __tablename__ = 'holdings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    product_symbol = db.Column(db.String(255), nullable=False)
    qty = db.Column(db.Numeric, nullable=False)
    avg_price = db.Column(db.Numeric, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    product_type = db.Column(db.Enum(ProductType), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'symbol': self.product_symbol,
            'shares': float(self.qty) if self.qty else 0,
            'avg_price': float(self.avg_price) if self.avg_price else 0,
            'last_updated': self.last_updated.isoformat(),
            'product_type': self.product_type.value
        }