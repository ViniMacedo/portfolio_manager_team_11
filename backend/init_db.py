from app import create_app, db
from app.models import User, Portfolio, Transaction, Holding, ProductType, TransactionType
from datetime import datetime, date, timezone
from decimal import Decimal
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# DB config for root user
DB_NAME = os.getenv('DB_NAME', 'portfolio_manager')
ROOT_USER = os.getenv('DB_ROOT_USER', 'root')
ROOT_PASSWORD = os.getenv('DB_ROOT_PASSWORD', '123456')
DB_HOST = os.getenv('DB_HOST', 'localhost')

# Connect as root without selecting a DB
connection = mysql.connector.connect(
    host=DB_HOST,
    user=ROOT_USER,
    password=ROOT_PASSWORD,
    autocommit=True
)

with connection.cursor() as cursor:
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME};")
    print(f"Database '{DB_NAME}' checked/created.")

connection.close()

def init_mock_data():
    # Create a mock user
    john = User(name='John Doe', balance=Decimal('100000.00'))
    db.session.add(john)
    db.session.flush()  # Assigns ID to john

    # Create a portfolio for John
    portfolio = Portfolio(
        user_id=john.id,
        name='Main Portfolio',
        created_at=datetime.now(timezone.utc)
    )
    db.session.add(portfolio)
    db.session.flush()

    # Create mock transactions
    mock_transactions = [
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('100'),
            price=Decimal('150.00'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 1, 15),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='GOOGL',
            qty=Decimal('50'),
            price=Decimal('2800.00'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 2, 1),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('20'),
            price=Decimal('170.00'),
            product_type=ProductType.STOCKS,
            type=TransactionType.SELL,
            transaction_date=date(2025, 3, 15),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='TLT',
            qty=Decimal('200'),
            price=Decimal('100.00'),
            product_type=ProductType.BONDS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 4, 1),
            fee=Decimal('9.99')
        )
    ]
    db.session.add_all(mock_transactions)

    # Create mock holdings
    mock_holdings = [
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('80'),
            avg_price=Decimal('150.00'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='GOOGL',
            qty=Decimal('50'),
            avg_price=Decimal('2800.00'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='TLT',
            qty=Decimal('200'),
            avg_price=Decimal('100.00'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.BONDS
        )
    ]
    db.session.add_all(mock_holdings)

    db.session.commit()
    print("Mock data initialized successfully!")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        init_mock_data()
        print("Database initialized successfully!")
