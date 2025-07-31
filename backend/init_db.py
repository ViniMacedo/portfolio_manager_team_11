from app import create_app, db
from app.models import User, Portfolio, Transaction, Holding, ProductType, TransactionType
from datetime import datetime, date, timezone
from decimal import Decimal

app = create_app()

def init_mock_data():
    # Create a mock user
    john = User(name='John Doe', balance=Decimal('100000.00'))
    db.session.add(john)
    db.session.flush()  # This will assign an ID to john

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
        # Buy AAPL stocks
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
        # Buy GOOGL stocks
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
        # Sell some AAPL stocks
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
        # Buy US Treasury Bonds
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
    
    for transaction in mock_transactions:
        db.session.add(transaction)

    # Create mock holdings 
    mock_holdings = [
        # AAPL holding (100 - 20 = 80 shares)
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='AAPL',
            qty=Decimal('80'),
            avg_price=Decimal('150.00'),
            current_price=Decimal('175.50'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        # GOOGL holding (50 shares)
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='GOOGL',
            qty=Decimal('50'),
            avg_price=Decimal('2800.00'),
            current_price=Decimal('2950.75'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.STOCKS
        ),
        # TLT holding (200 bonds)
        Holding(
            portfolio_id=portfolio.id,
            product_symbol='TLT',
            qty=Decimal('200'),
            avg_price=Decimal('100.00'),
            current_price=Decimal('98.45'),
            last_updated=datetime.now(timezone.utc),
            product_type=ProductType.BONDS
        )
    ]

    for holding in mock_holdings:
        db.session.add(holding)

    db.session.commit()
    print("Mock data initialized successfully!")

with app.app_context():
    # Drop all existing tables
    db.drop_all()
    
    # Create all tables based on models
    db.create_all()
    
    # Initialize mock data
    init_mock_data()
    
    print("Database initialized successfully!")
