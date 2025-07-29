from flask import Flask
from flask_cors import CORS
from .api import api_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
