#!/usr/bin/env python3
"""
Script to check the current portfolio data and calculate performance metrics
"""

from app import create_app, db
from app.models import User, Portfolio, Transaction, Holding
from datetime import datetime
from decimal import Decimal

def check_portfolio_data():
    app = create_app()
    with app.app_context():
        # Get the user and portfolio
        user = User.query.first()
        if not user:
            print("No user found!")
            return
        
        portfolio = Portfolio.query.filter_by(user_id=user.id).first()
        if not portfolio:
            print("No portfolio found!")
            return
        
        print(f"=== Portfolio Analysis for {user.name} ===")
        print(f"Portfolio: {portfolio.name}")
        print(f"Cash Balance: ${user.balance:,.2f}")
        print(f"Created: {portfolio.created_at}")
        print()
        
        # Show all transactions
        transactions = Transaction.query.filter_by(portfolio_id=portfolio.id).order_by(Transaction.transaction_date).all()
        print(f"=== Transaction History ({len(transactions)} transactions) ===")
        total_invested = Decimal('0')
        for txn in transactions:
            action_value = txn.qty * txn.price
            if txn.type.value == 'BUY':
                total_invested += action_value
                print(f"{txn.transaction_date} | BUY  {txn.qty:>6} {txn.product_symbol:<6} @ ${txn.price:>8.2f} = ${action_value:>10,.2f}")
            else:
                total_invested -= action_value
                print(f"{txn.transaction_date} | SELL {txn.qty:>6} {txn.product_symbol:<6} @ ${txn.price:>8.2f} = ${action_value:>10,.2f}")
        
        print(f"\nTotal Net Investment: ${total_invested:,.2f}")
        print()
        
        # Show current holdings
        holdings = Holding.query.filter_by(portfolio_id=portfolio.id).all()
        print(f"=== Current Holdings ({len(holdings)} positions) ===")
        total_portfolio_value = Decimal('0')
        total_cost_basis = Decimal('0')
        
        for holding in holdings:
            cost_basis = holding.qty * holding.avg_price
            # Using current average price as proxy for current value (in real app, would fetch live prices)
            current_value = holding.qty * holding.avg_price * Decimal('1.05')  # Assume 5% avg gain for demo
            gain_loss = current_value - cost_basis
            gain_loss_pct = (gain_loss / cost_basis * 100) if cost_basis > 0 else 0
            
            total_portfolio_value += current_value
            total_cost_basis += cost_basis
            
            print(f"{holding.product_symbol:<6} | {holding.qty:>6} shares @ ${holding.avg_price:>8.2f} avg | Cost: ${cost_basis:>10,.2f} | Value: ${current_value:>10,.2f} | P&L: ${gain_loss:>8,.2f} ({gain_loss_pct:>5.1f}%)")
        
        print(f"\n=== Portfolio Summary ===")
        print(f"Total Cost Basis:     ${total_cost_basis:>12,.2f}")
        print(f"Current Value:        ${total_portfolio_value:>12,.2f}")
        total_gain_loss = total_portfolio_value - total_cost_basis
        total_gain_loss_pct = (total_gain_loss / total_cost_basis * 100) if total_cost_basis > 0 else 0
        print(f"Total Gain/Loss:      ${total_gain_loss:>12,.2f} ({total_gain_loss_pct:>5.1f}%)")
        print(f"Available Cash:       ${user.balance:>12,.2f}")
        print(f"Total Account Value:  ${total_portfolio_value + user.balance:>12,.2f}")

if __name__ == '__main__':
    check_portfolio_data()
