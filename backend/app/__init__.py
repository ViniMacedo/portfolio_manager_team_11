from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_ROOT_USER', 'root')}:{os.getenv('DB_ROOT_PASSWORD', '123456')}@{os.getenv('DB_HOST', 'localhost')}/{os.getenv('DB_NAME', 'portfolio_manager')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Initialize extensions
    db.init_app(app)
    
    # Enable CORS for React frontend
    CORS(app, origins=['http://localhost:3000', 'http://localhost:5173']) 
    
    # Register API blueprint
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    return app