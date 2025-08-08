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
    john = User(name='John Doe', balance=Decimal('75000.00'))
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

    # Create comprehensive mock transactions spanning the last month
    # Demonstrating various trading activities with realistic prices
    mock_transactions = [
        # Week 1 (July 10-16, 2025) - Initial purchases
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('150'),
            price=Decimal('190.50'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 10),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='MSFT',
            qty=Decimal('100'),
            price=Decimal('425.00'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 12),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='NVDA',
            qty=Decimal('75'),
            price=Decimal('880.00'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 15),
            fee=Decimal('9.99')
        ),
        
        # Week 2 (July 17-23, 2025) - Adding diversity
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='GOOGL',
            qty=Decimal('40'),
            price=Decimal('175.20'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 18),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='TSLA',
            qty=Decimal('80'),
            price=Decimal('245.30'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 20),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='META',
            qty=Decimal('60'),
            price=Decimal('485.75'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 22),
            fee=Decimal('9.99')
        ),
        
        # Week 3 (July 24-30, 2025) - Some profit taking
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='NVDA',
            qty=Decimal('25'),
            price=Decimal('920.50'),
            product_type=ProductType.STOCKS,
            type=TransactionType.SELL,
            transaction_date=date(2025, 7, 26),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='AMZN',
            qty=Decimal('50'),
            price=Decimal('145.80'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 7, 28),
            fee=Decimal('9.99')
        ),
        
        # Week 4 (July 31 - Aug 6, 2025) - Recent activity
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('50'),
            price=Decimal('198.20'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 8, 1),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='MSFT',
            qty=Decimal('30'),
            price=Decimal('438.50'),
            product_type=ProductType.STOCKS,
            type=TransactionType.BUY,
            transaction_date=date(2025, 8, 3),
            fee=Decimal('9.99')
        ),
        Transaction(
            portfolio_id=portfolio.id,
            product_symbol='META',
            qty=Decimal('20'),
            price=Decimal('495.60'),
            product_type=ProductType.STOCKS,
            type=TransactionType.SELL,
            transaction_date=date(2025, 8, 5),
            fee=Decimal('9.99')
        )
    ]
    db.session.add_all(mock_transactions)

    # Create current holdings reflecting all transactions
    # These represent the final positions after all trading activity
    mock_holdings = [
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('200'),  # 150 + 50 = 200 shares
            avg_price=Decimal('193.22'),  # Weighted average: (150*190.50 + 50*198.20) / 200
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='MSFT',
            qty=Decimal('130'),  # 100 + 30 = 130 shares
            avg_price=Decimal('428.08'),  # Weighted average: (100*425.00 + 30*438.50) / 130
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='NVDA',
            qty=Decimal('50'),   # 75 - 25 = 50 shares
            avg_price=Decimal('880.00'),  # Original purchase price
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='GOOGL',
            qty=Decimal('40'),
            avg_price=Decimal('175.20'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='TSLA',
            qty=Decimal('80'),
            avg_price=Decimal('245.30'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='META',
            qty=Decimal('40'),   # 60 - 20 = 40 shares
            avg_price=Decimal('485.75'),  # Original purchase price
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='AMZN',
            qty=Decimal('50'),
            avg_price=Decimal('145.80'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        )
    ]
    db.session.add_all(mock_holdings)

    db.session.commit()
    print("Enhanced mock data with month-long trading history initialized successfully!")
    print(f"Portfolio contains {len(mock_holdings)} holdings with {len(mock_transactions)} transactions")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        init_mock_data()
        print("Database initialized successfully!")
