from app import create_app, db
from app.models import User, Portfolio, Transaction, Holding

app = create_app()

with app.app_context():
    # Drop all existing tables
    db.drop_all()
    
    # Create all tables based on models
    db.create_all()
    
    print("Database initialized successfully!")
