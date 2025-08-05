import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

    # Build the SQLALCHEMY_DATABASE_URI from environment variables
    DB_USER = os.getenv('DB_ROOT_USER', 'root')
    DB_PASSWORD = os.getenv('DB_ROOT_PASSWORD', 'n3u3da!')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = os.getenv('DB_NAME', 'portfolio_manager')

    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
