from backend.app.api.quote import QuoteResource
from flask_restful import Resource
from flask import request
from app.models import db, Portfolio, Transaction, Holding, User, ProductType, TransactionType
from datetime import date
from decimal import Decimal
    
class TransactionResource(Resource):
    def post(self):
        data = request.get_json()
        required_fields = ['user_id', 'portfolio_id', 'product_symbol', 'qty', 'price', 'type']
        if not all(field in data for field in required_fields):
            return {'error': 'Missing required fields'}, 400

        try:
            user_id = int(data['user_id'])
            portfolio_id = int(data['portfolio_id'])
            product_symbol = data['product_symbol'].upper()
            qty = Decimal(data['qty'])
            price = Decimal(data['price'])
            tx_type = TransactionType(data['type'])
        except Exception as e:
            return {'error': f'Invalid input: {str(e)}'}, 400

        fee = Decimal("0.00") # TODO?
        product_type = ProductType.STOCKS

        # Get user and portfolio
        result = self._get_user_and_portfolio(user_id, portfolio_id)
        if isinstance(result, tuple):
            return result
        user, portfolio = result

        # Check price
        price_check = self._validate_price_against_market(product_symbol, float(price))
        if price_check:
            return price_check

        # Execute transaction
        match tx_type:
            case TransactionType.BUY:
                result = self._handle_buy(user, portfolio.id, product_symbol, qty, price, fee, product_type)
            case TransactionType.SELL:
                result = self._handle_sell(user, portfolio.id, product_symbol, qty, price, fee)
            case _:
                return {'error': 'Unsupported transaction type'}, 400


        if result is not None:  # Error occurred
            return result

        # Log transaction
        transaction = Transaction(
            portfolio_id=portfolio.id,
            product_symbol=product_symbol,
            qty=qty,
            price=price,
            product_type=product_type,
            type=tx_type,
            transaction_date=date.today(),
            fee=fee
        )
        db.session.add(transaction)
        db.session.commit()

        return {'message': f'{tx_type.value} transaction completed successfully'}

    def _get_user_and_portfolio(self, user_id, portfolio_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        portfolio = Portfolio.query.get(portfolio_id)
        if not portfolio:
            return {'error': 'Portfolio not found'}, 404

        if portfolio.user_id != user.id:
            return {'error': 'Portfolio does not belong to user'}, 403

        return user, portfolio

    def _validate_price_against_market(self, symbol, user_price):
        market_price = QuoteResource.get_current_price(symbol)
        if market_price is None:
            return {'error': f"Could not retrieve market price for {symbol}"}, 400

        diff_pct = abs((user_price - market_price) / market_price) * 100
        if diff_pct > 1: # arbitrary 1% threshold
            return {
                "warning": "The price you entered is different from the current market price.",
                "market_price": round(market_price, 2),
                "your_price": round(user_price, 2),
                "difference_percent": round(diff_pct, 2)
            }, 400

        return None

    def _handle_buy(self, user, portfolio_id, symbol, qty, price, fee, product_type):
        total_cost = qty * price + fee
        if user.balance < total_cost:
            return {'error': 'Insufficient balance'}, 400

        holding = Holding.query.filter_by(portfolio_id=portfolio_id, product_symbol=symbol).first()
        if holding:
            new_total_qty = holding.qty + qty
            holding.avg_price = ((holding.avg_price * holding.qty) + (price * qty)) / new_total_qty
            holding.qty = new_total_qty
            holding.current_price = price
        else:
            holding = Holding(
                portfolio_id=portfolio_id,
                product_symbol=symbol,
                qty=qty,
                avg_price=price,
                current_price=price,
                product_type=product_type
            )
            db.session.add(holding)

        user.balance -= total_cost
        return None

    def _handle_sell(self, user, portfolio_id, symbol, qty, price, fee):
        holding = Holding.query.filter_by(portfolio_id=portfolio_id, product_symbol=symbol).first()
        if not holding or holding.qty < qty:
            return {'error': 'Not enough shares to sell'}, 400

        total_gain = qty * price - fee
        holding.qty -= qty
        holding.current_price = price

        if holding.qty == 0:
            db.session.delete(holding)

        user.balance += total_gain
        return None
