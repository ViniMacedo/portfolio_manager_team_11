# backend/app/app.py  
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

# Create SQLAlchemy instance here
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Database configuration
    DB_NAME = os.getenv('DB_NAME', 'portfolio_manager')
    ROOT_USER = os.getenv('DB_ROOT_USER', 'root')
    ROOT_PASSWORD = os.getenv('DB_ROOT_PASSWORD', '123456')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{ROOT_USER}:{ROOT_PASSWORD}@{DB_HOST}/{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Initialize SQLAlchemy with the app
    db.init_app(app)
    
    # Enable CORS with explicit configuration
    CORS(app, 
         origins=['http://localhost:5173', 'http://localhost:3000'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    # Alternative: If flask-cors doesn't work, use manual CORS headers
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    # Import models to ensure they're registered (IMPORTANT: Import after db.init_app)
    with app.app_context():
        from app.models import User, Portfolio, Transaction, Holding, ProductType, TransactionType
        
        # Register API routes
        from app.routes import api
        app.register_blueprint(api, url_prefix='/api')
    
    # Home route
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Portfolio Manager API Server',
            'api_base': '/api',
            'status': 'running',
            'test_endpoint': '/api/test'
        })
    
    return app